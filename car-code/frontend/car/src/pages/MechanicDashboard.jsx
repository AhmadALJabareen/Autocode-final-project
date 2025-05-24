import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OverviewTab from '../components/OverviewTab';
import BookingsTab from '../components/BookingsTabMech';
import SlotsTab from '../components/SlotsTab';
import ProfileTab from '../components/ProfileTab';
import EarningsTab from '../components/EarningsTab';
import SettingsTab from '../components/SettingsTabMech';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

export default function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]); // State جديد للحجوزات القادمة
  const [slots, setSlots] = useState([]);
  const [mechanic, setMechanic] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    console.log('Checking authentication...');
    try {
      const response = await axios.get('http://localhost:4000/api/mechanic/me');
      console.log('Mechanic is authenticated');
      console.log(response.data.mechanic);
      setMechanic(response.data.mechanic);
      setUserId(response.data.mechanic.user._id);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async () => {
    console.log('Starting fetchData...');
    setLoading(true);
    try {
      const mechanicResponse = await axios.get('http://localhost:4000/api/mechanic/me');
      setMechanic(mechanicResponse.data.mechanic);
      setUserId(mechanicResponse.data.mechanic.user._id);

      const bookingsResponse = await axios.get('http://localhost:4000/api/bookings/my');
      const allBookings = bookingsResponse.data.bookings;
      setBookings(allBookings);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // إزالة الوقت للمقارنة بالتاريخ فقط
      const upcoming = allBookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today;
      });
      console.log('Upcoming bookings:', upcoming);
      setUpcomingBookings(upcoming);

      const slotsResponse = await axios.get(`http://localhost:4000/api/slots/mechanic/me`);
      setSlots(slotsResponse.data.slots);

      const earningsResponse = await axios.get('http://localhost:4000/api/mechanic/earnings');
      setEarnings(earningsResponse.data.earnings);
    } catch (error) {
      console.error('Error fetching data:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    console.log('Initial auth check on mount');
    checkAuth();
  }, [checkAuth]);

  // Fetch data only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle booking status
  const handleBookingStatus = async (bookingId, newStatus) => {
    try {
      const endpoint = newStatus === 'accepted' ? `/api/bookings/accept/${bookingId}` : `/api/bookings/reject/${bookingId}`;
      const response = await axios.post(`http://localhost:4000${endpoint}`, {}, { withCredentials: true });
      const updatedBooking = response.data.booking;
      setBookings(bookings.map(b => (b._id === bookingId ? updatedBooking : b)));
      // تحديث upcomingBookings
      setUpcomingBookings(upcomingBookings.map(b => (b._id === bookingId ? updatedBooking : b)));
      if (newStatus === 'accepted' || newStatus === 'rejected') {
        setNotifications((prev) => Math.max(0, prev - 1));
      }
      toast.success(`تم ${newStatus === 'accepted' ? 'قبول' : 'رفض'} الحجز بنجاح`);
    } catch (error) {
      console.error(`Error updating booking status to ${newStatus}:`, error);
      
    }
  };

  // Add new slot
  const addSlot = async (date, time) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/slots/add',
        { date, time },
        { withCredentials: true }
      );
      setSlots([...slots, response.data.slot]);
      toast.success('تم إضافة الموعد بنجاح');
    } catch (error) {
      console.error('Error adding slot:', error);
      toast.error('فشل إضافة الموعد');
    }
  };

  // Remove slot
  const removeSlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:4000/api/slots/remove/${slotId}`, { withCredentials: true });
      setSlots(slots.filter(s => s._id !== slotId));
      toast.success('تم حذف الموعد بنجاح');
    } catch (error) {
      console.error('Error removing slot:', error);
      toast.error('فشل حذف الموعد');
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const response = await axios.put('http://localhost:4000/api/mechanic/me', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMechanic(response.data.mechanic);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('فشل تحديث الملف الشخصي');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      navigate('/');
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('فشل تسجيل الخروج');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If loading or not authenticated
  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-xl font-bold text-blue-900">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-right" dir="rtl">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 overflow-y-auto">
        <Header
          mechanic={mechanic}
          notifications={notifications}
          setNotifications={setNotifications}
          userId={userId}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab
              bookings={upcomingBookings} // استخدام upcomingBookings بدل bookings
              mechanic={mechanic}
              handleBookingStatus={handleBookingStatus}
            />
          )}
          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings} // استخدام bookings الكامل لعرض كل الحجوزات
              setBookings={setBookings}
              handleBookingStatus={handleBookingStatus}
              fetchData={fetchData}
            />
          )}
          {activeTab === 'slots' && (
            <SlotsTab slots={slots} setSlots={setSlots} addSlot={addSlot} removeSlot={removeSlot} />
          )}
          {activeTab === 'profile' && <ProfileTab mechanic={mechanic} updateProfile={updateProfile} />}
          {activeTab === 'earnings' && <EarningsTab bookings={bookings} mechanic={mechanic} earnings={earnings} />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}