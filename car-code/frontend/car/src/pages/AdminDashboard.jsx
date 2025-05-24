import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarAdmin';
import Header from '../components/HeaderAdmin';
import DashboardTab from '../components/DashboardTabAdmin';
import UsersTab from '../components/UsersTabAdmin';
import MechanicsTab from '../components/MechanicsTabAdmin';
import ArticlesTab from '../components/ArticlesTab';
import PartsTab from '../components/PartsTab';
import BookingsTab from '../components/BookingsTab';
import SettingsTab from '../components/SettingsTab';
import MessagesTable from '../components/MessagesTable'; 
import io from 'socket.io-client';
// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

// Initialize socket
const socket = io('http://localhost:4000', {
  withCredentials: true,
  autoConnect: false,
});

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [stats, setStats] = useState({ bookings: [], revenue: [], userTypes: [] });
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check admin authentication
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/me');
      setAdmin(response.data.admin);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Admin Auth Error:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        usersResponse,
        mechanicsResponse,
        partsResponse,
        articlesResponse,
        bookingsResponse,
        statsResponse,
        contactMessagesResponse,
      ] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/users'),
        axios.get('http://localhost:4000/api/admin/mechanics'),
        axios.get('http://localhost:4000/api/admin/parts'),
        axios.get('http://localhost:4000/api/admin/articles'),
        axios.get('http://localhost:4000/api/admin/bookings'),
        axios.get('http://localhost:4000/api/admin/stats'),
        axios.get('http://localhost:4000/api/admin/contact-messages'),
      ]);
      setUsers(usersResponse.data.users);
      setMechanics(mechanicsResponse.data.mechanics);
      setParts(partsResponse.data.parts);
      setArticles(articlesResponse.data.articles);
      setBookings(bookingsResponse.data.bookings);
      setStats(statsResponse.data);
      setContactMessages(contactMessagesResponse.data.messages);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data?.message || error.message);
      toast.error('فشل جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle WebSocket events
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Attempting to connect to WebSocket...');
      socket.connect();

      socket.on('connect', () => {
        console.log('WebSocket connected:', socket.id);
        socket.emit('joinAdmin');
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error.message);
      });

      socket.on('newContactMessage', (message) => {
        console.log('New contact message received:', message);
        setNotifications(prev => [{
          id: message.id,
          type: 'message',
          message: `رسالة تواصل جديدة من ${message.name}: ${message.message}`,
          createdAt: message.createdAt,
        }, ...prev]);
        toast.info(`رسالة تواصل جديدة من ${message.name}`, {
          onClick: () => setActiveTab('messages'),
        });
        const audio = new Audio('/notification.mp3');
        audio.play().catch(err => console.error('Error playing sound:', err));
      });

      socket.on('newPart', (part) => {
        console.log('New part received:', part);
        setNotifications(prev => [{
          id: part.id,
          type: 'part',
          message: `قطعة غيار جديدة: ${part.name} (${part.price} ريال)`,
          createdAt: part.createdAt,
        }, ...prev]);
        toast.info(`قطعة غيار جديدة: ${part.name}`, {
          onClick: () => setActiveTab('parts'),
        });
        const audio = new Audio('/notification.mp3');
        audio.play().catch(err => console.error('Error playing sound:', err));
      });

      return () => {
        socket.off('connect');
        socket.off('connect_error');
        socket.off('newContactMessage');
        socket.off('newPart');
        socket.disconnect();
        console.log('WebSocket disconnected');
      };
    }
  }, [isAuthenticated]);

  // Check auth and fetch data on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle part state update
  const handlePartState = async (partId, state) => {
    try {
      await axios.put(`http://localhost:4000/api/admin/parts/${partId}`, { state });
      setParts(parts.map(p => p._id === partId ? { ...p, state } : p));
      toast.success(`تم ${state === 'approved' ? 'الموافقة على' : 'رفض'} القطعة`);
    } catch (error) {
      console.error('Error updating part state:', error);
      toast.error('فشل تحديث حالة القطعة');
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profilePic', file);
    
    try {
      const response = await axios.post('http://localhost:4000/api/admin/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAdmin(response.data.admin);
      toast.success('تم رفع الصورة الشخصية');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('فشل رفع الصورة');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = e.target.elements;
    
    if (newPassword.value !== confirmPassword.value) {
      toast.error('كلمة المرور الجديدة لا تتطابق');
      return;
    }
    
    try {
      await axios.post('http://localhost:4000/api/admin/change-password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      toast.success('تم تغيير كلمة المرور بنجاح');
      e.target.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'فشل تغيير كلمة المرور');
    }
  };

  // Handle contact message reply
  const handleReplyToMessage = async (messageId, reply) => {
    try {
      await axios.post('http://localhost:4000/api/admin/contact-messages/reply', {
        messageId,
        reply,
      });
      setContactMessages(messages =>
        messages.map(msg =>
          msg._id === messageId ? { ...msg, status: 'replied', reply } : msg
        )
      );
      toast.success('تم إرسال الرد بنجاح');
    } catch (error) {
      console.error('Error replying to message:', error);
      toast.error(error.response?.data?.message || 'فشل إرسال الرد');
    }
  };

  // Handle adding a new article
  const handleAddArticle = async (articleData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/admin/articles', articleData);
      setArticles([response.data.article, ...articles]);
      toast.success('تم إضافة المقال بنجاح');
    } catch (error) {
      console.error('Error adding article:', error);
      toast.error(error.response?.data?.message || 'فشل إضافة المقال');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout');
      navigate('/');
      toast.success('تم تسجيل الخروج');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('فشل تسجيل الخروج');
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex min-h-screen justify-center items-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 text-right" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          admin={admin} 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications} 
          notifications={notifications}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              users={users} 
              mechanics={mechanics} 
              parts={parts} 
              articles={articles} 
              stats={stats} 
            />
          )}
          {activeTab === 'users' && <UsersTab users={users} />}
          {activeTab === 'mechanics' && <MechanicsTab mechanics={mechanics} />}
          {activeTab === 'articles' && <ArticlesTab articles={articles} handleAddArticle={handleAddArticle} />}
          {activeTab === 'parts' && <PartsTab parts={parts} handlePartState={handlePartState} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          {activeTab === 'messages' && (
            <MessagesTable 
              contactMessages={contactMessages} 
              handleReplyToMessage={handleReplyToMessage}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab 
              admin={admin} 
              handleProfilePicUpload={handleProfilePicUpload} 
              handlePasswordChange={handlePasswordChange} 
            />
          )}
        </main>
      </div>
    </div>
  );
}