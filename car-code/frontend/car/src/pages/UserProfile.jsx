import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Package, History, FileText, Settings, Bell, LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000; // 5 seconds timeout

export default function UserProfile() {
  // States
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    createdAt: '',
    image: null,
    id: '',
  });
  const [myParts, setMyParts] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [errorCodeHistory, setErrorCodeHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    price: '',
    specifications: '',
    carModel: '',
    condition: 'جديد',
    image: null,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    console.log('Fetching user data...');
    try {
      const response = await axios.get('http://localhost:4000/api/users/me');
      console.log('User Response:', response.data);
      console.log('User Image Path:', response.data.image); // Log image path
      setUserData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.location || '',
        createdAt: response.data.createdAt
          ? new Date(response.data.createdAt).toLocaleDateString('ar-EG')
          : '',
        image: response.data.image || null,
        id: response.data._id || '',
      });
      return response.data._id;
    } catch (error) {
      console.error('User Fetch Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل جلب بيانات المستخدم: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
      return null;
    }
  }, [navigate]);

  // Fetch parts
  const fetchParts = useCallback(async (userId) => {
    console.log('Fetching parts for user:', userId);
    try {
      const response = await axios.get('http://localhost:4000/api/parts/my');
      console.log('Parts Response:', response.data);
      const parts = response.data.parts || [];
      if (!Array.isArray(parts)) {
        console.warn('Unexpected parts response:', response.data);
        setMyParts([]);
      } else {
        console.log('Parts fetched successfully:', parts);
        setMyParts(parts);
      }
    } catch (error) {
      console.error('Parts Fetch Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل جلب القطع: ${error.response?.data?.message || error.message}`);
      setMyParts([]);
    }
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    console.log('Fetching bookings...');
    try {
      const response = await axios.get('http://localhost:4000/api/bookings/my-user');
      console.log('Bookings Response:', response.data);
      setMyBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Bookings Fetch Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل جلب المواعيد: ${error.response?.data?.message || error.message}`);
      setMyBookings([]);
    }
  }, []);

  // Fetch error codes
  const fetchErrorCodes = useCallback(async () => {
    console.log('Fetching error codes...');
    try {
      const response = await axios.get('http://localhost:4000/api/codes/history');
      console.log('Error Codes Response:', response.data);
      setErrorCodeHistory(response.data.errorCodes || []);
    } catch (error) {
      console.error('Error Codes Fetch Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل جلب أكواد الأعطال: ${error.response?.data?.message || error.message}`);
      setErrorCodeHistory([]);
    }
  }, []);

  // Main fetch function
  const fetchData = useCallback(async () => {
    console.log('Starting fetchData...');
    setLoading(true);
    try {
      const userId = await fetchUserData();
      if (userId) {
        await Promise.all([fetchParts(userId), fetchBookings(), fetchErrorCodes()]);
      } else {
        console.warn('No user ID, skipping other fetches');
      }
    } finally {
      console.log('fetchData completed, setting loading to false');
      setLoading(false);
    }
  }, [fetchUserData, fetchParts, fetchBookings, fetchErrorCodes]);

  // Fetch data on mount
  useEffect(() => {
    console.log('Initial fetchData on mount');
    fetchData();
  }, [fetchData]);

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile:', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        hasImage: !!profileImage,
      });
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('location', userData.address);
      if (profileImage) {
        console.log('Uploading profile image:', profileImage.name);
        formData.append('image', profileImage);
      }
  
      const response = await axios.put('http://localhost:4000/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000, // زيادة الـ timeout لـ 10 ثواني
      });
      console.log('Profile Update Response:', response.data);
  
      // تحديث userData بالبيانات الجديدة
      setUserData({
        ...userData,
        name: response.data.user.name || userData.name,
        email: response.data.user.email || userData.email,
        phone: response.data.user.phone || userData.phone,
        address: response.data.user.location || userData.address,
        image: response.data.user.image || userData.image,
      });
  
      toast.success('تم تحديث الملف الشخصي');
      setEditMode(false);
      setProfileImage(null);
    } catch (error) {
      console.error('Save Profile Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل تحديث الملف: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle add part
  const handleAddPart = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newPart.name);
    formData.append('price', newPart.price);
    formData.append('specifications', newPart.specifications);
    formData.append('carModel', newPart.carModel);
    formData.append('condition', newPart.condition);
    if (newPart.image) {
      formData.append('image', newPart.image);
    }

    try {
      console.log('Adding new part:', newPart);
      const response = await axios.post('http://localhost:4000/api/parts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Part added successfully:', response.data.part);
      setNewPart({ name: '', price: '', specifications: '', carModel: '', condition: 'جديد', image: null });
      setShowAddPartForm(false);
      toast.success('تم إضافة القطعة');
      await fetchData();
    } catch (error) {
      console.error('Add Part Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل إضافة القطعة: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axios.post('http://localhost:4000/api/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.response?.data?.message || error.message);
      toast.error('فشل تسجيل الخروج');
    }
  };

  // UI
  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-xl font-bold text-purple-900">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <div className="bg-white shadow w-64 hidden md:block border-l border-gray-200">
        <div className="p-5 border-b border-gray-200 text-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
          <div className="h-24 w-24 rounded-full bg-yellow-400 text-indigo-900 text-4xl flex items-center justify-center mx-auto mb-3 border-4 border-yellow-300 shadow-lg">
            {userData.image ? (
              <img
                src={`http://localhost:4000${userData.image}`}
                alt="صورة المستخدم"
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  console.error('Failed to load profile image:', userData.image);
                  e.target.style.display = 'none'; // Hide broken image
                  e.target.nextSibling.style.display = 'flex'; // Show fallback
                }}
              />
            ) : null}
            <div
              className={`h-full w-full rounded-full bg-yellow-400 text-indigo-900 text-4xl flex items-center justify-center ${
                userData.image ? 'hidden' : 'flex'
              }`}
            >
              {userData.name.charAt(0)}
            </div>
          </div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-gray-300 text-sm">{userData.email}</p>
        </div>
        <nav className="p-4">
          <ul>
            {[
              { id: 'profile', label: 'الملف الشخصي', icon: <User size={18} className="ml-2" /> },
              { id: 'bookings', label: 'مواعيدي', icon: <Calendar size={18} className="ml-2" /> },
              { id: 'errorCodes', label: 'سجل أكواد الأعطال', icon: <History size={18} className="ml-2" /> },
              { id: 'parts', label: 'قطع الغيار', icon: <Package size={18} className="ml-2" /> },
              { id: 'settings', label: 'الإعدادات', icon: <Settings size={18} className="ml-2" /> },
            ].map((tab) => (
              <li
                key={tab.id}
                className={`mb-2 rounded hover:bg-purple-50 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-purple-100 text-purple-900 border-r-4 border-purple-900' 
                    : 'text-gray-700'
                }`}
              >
                <button onClick={() => setActiveTab(tab.id)} className="flex items-center p-3 w-full">
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded w-full transition-all duration-200"
          >
            <LogOut size={18} className="ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl font-bold md:hidden text-purple-900">ملفي الشخصي</h1>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-purple-100 relative transition-all duration-200"
              >
                <Bell size={20} className="text-purple-900" />
                <span className="absolute top-1 right-1 bg-yellow-400 text-indigo-900 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {myBookings.filter((b) => b.status === 'مؤكد').length}
                </span>
              </button>
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-purple-900 to-indigo-900">
                    <h3 className="font-bold text-white">الإشعارات</h3>
                  </div>
                  <ul>
                    {myBookings
                      .filter((b) => b.status === 'مؤكد')
                      .map((booking) => (
                        <li key={booking.id} className="p-2 hover:bg-purple-50 border-b border-gray-200">
                          <p className="text-sm">تم تأكيد موعد {booking.service} ليوم {booking.date}</p>
                          <span className="text-xs text-gray-500">{booking.time}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="md:hidden ml-2">
              <button className="p-2 rounded-full bg-yellow-400 text-indigo-900 font-bold">
                {userData.name.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">الملف الشخصي</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800 transition-all duration-200 shadow"
                >
                  تعديل الملف
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setProfileImage(null);
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-all duration-200"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                  <div className="h-40 w-40 rounded-full bg-yellow-400 text-indigo-900 text-6xl flex items-center justify-center mb-4 relative border-4 border-yellow-300 shadow">
                    {userData.image ? (
                      <img
                        src={`http://localhost:4000${userData.image}`}
                        alt="صورة المستخدم"
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load profile image:', userData.image);
                          e.target.style.display = 'none'; // Hide broken image
                          e.target.nextSibling.style.display = 'flex'; // Show fallback
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-full w-full rounded-full bg-yellow-400 text-indigo-900 text-6xl flex items-center justify-center ${
                        userData.image ? 'hidden' : 'flex'
                      }`}
                    >
                      {userData.name.charAt(0)}
                    </div>
                  </div>
                  {editMode && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          console.log('Selected profile image:', e.target.files[0].name);
                          setProfileImage(e.target.files[0]);
                        }
                      }}
                      className="mt-2 text-purple-900 file:bg-yellow-400 file:border-0 file:text-indigo-900 file:rounded file:px-3 file:py-1 file:mr-2 cursor-pointer file:cursor-pointer file:font-bold hover:file:bg-yellow-500 file:transition-all file:duration-200"
                    />
                  )}
                </div>
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">الاسم الكامل</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="font-semibold text-purple-900">{userData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">البريد الإلكتروني</label>
                      {editMode ? (
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="font-semibold text-purple-900">{userData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">رقم الهاتف</label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="font-semibold text-purple-900">{userData.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">العنوان</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={userData.address}
                          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="font-semibold text-purple-900">{userData.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">عضو منذ</label>
                      <p className="font-semibold text-indigo-900">{userData.createdAt}</p>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">معرف المستخدم</label>
                      <p className="font-semibold text-gray-500 text-sm">{userData.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
  <div className="p-4 md:p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-purple-900">مواعيدي</h2>
      <button
        onClick={() => navigate('/mechanics')}
        className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold"
      >
        حجز موعد جديد
      </button>
    </div>
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      {myBookings.length === 0 ? (
        <div className="text-center p-8">
          <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4">ليس لديك أي مواعيد محجوزة</p>
          <button
            onClick={() => navigate('/mechanics')}
            className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold"
          >
            حجز موعد
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
                <th className="py-3 px-4 text-right">الخدمة</th>
                <th className="py-3 px-4 text-right">التاريخ</th>
                <th className="py-3 px-4 text-right">الوقت</th>
                <th className="py-3 px-4 text-right">الميكانيكي</th>
                <th className="py-3 px-4 text-right">المكان</th>
                <th className="py-3 px-4 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-purple-50 transition-all duration-200">
                  <td className="py-3 px-4">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                  <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3 px-4">{booking.time}</td>
                  <td className="py-3 px-4">{booking.mechanic.user.name || 'غير معروف'}</td>
                  <td className="py-3 px-4">{booking.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'مؤكد'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'ملغي'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
        {/* Error Codes Tab */}
        {activeTab === 'errorCodes' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">سجل أكواد الأعطال</h2>
              <button className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold">
                البحث عن كود عطل
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              {errorCodeHistory.length === 0 ? (
                <div className="text-center p-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">لم تقم بالبحث عن أي أكواد أعطال بعد</p>
                  <button className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold">
                    البحث عن كود عطل
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
                        <th className="py-3 px-4 text-right">كود العطل</th>
                        <th className="py-3 px-4 text-right">تاريخ البحث</th>
                        <th className="py-3 px-4 text-right">الوصف</th>
                        <th className="py-3 px-4 text-right">الحل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorCodeHistory.map((error) => (
                        <tr key={error._id} className="border-b hover:bg-purple-50 transition-all duration-200">
                          <td className="py-3 px-4 font-mono font-bold text-red-600">{error.code}</td>
                          <td className="py-3 px-4">{new Date(error.createdAt).toLocaleDateString('ar-EG')}</td>
                          <td className="py-3 px-4">{error.description}</td>
                          <td className="py-3 px-4">{error.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parts Tab */}
        {activeTab === 'parts' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">قطع الغيار الخاصة بي</h2>
              <button
                onClick={() => setShowAddPartForm(!showAddPartForm)}
                className={`${
                  showAddPartForm 
                    ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' 
                    : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-500'
                } px-4 py-2 rounded transition-all duration-200 shadow font-bold`}
              >
                {showAddPartForm ? 'إلغاء' : 'إضافة قطعة غيار'}
              </button>
            </div>

            {/* Add Part Form */}
            {showAddPartForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200 border-t-4 border-t-purple-900">
                <h3 className="text-lg font-bold mb-4 text-purple-900">إضافة قطعة غيار جديدة</h3>
                <form onSubmit={handleAddPart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">اسم القطعة</label>
                    <input
                      type="text"
                      value={newPart.name}
                      onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">السعر</label>
                    <input
                      type="number"
                      value={newPart.price}
                      onChange={(e) => setNewPart({ ...newPart, price: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">موديل السيارة</label>
                    <input
                      type="text"
                      value={newPart.carModel}
                      onChange={(e) => setNewPart({ ...newPart, carModel: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">الحالة</label>
                    <select
                      value={newPart.condition}
                      onChange={(e) => setNewPart({ ...newPart, condition: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      <option value="جديد">جديد</option>
                      <option value="مستعمل">مستعمل</option>
                      <option value="مجدد">مجدد</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm mb-2">المواصفات</label>
                    <textarea
                      value={newPart.specifications}
                      onChange={(e) => setNewPart({ ...newPart, specifications: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm mb-2">صورة القطعة</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setNewPart({ ...newPart, image: e.target.files[0] });
                        }
                      }}
                      className="w-full p-2 text-purple-900 file:bg-yellow-400 file:border-0 file:text-indigo-900 file:rounded file:px-3 file:py-1 file:mr-2 cursor-pointer file:cursor-pointer file:font-bold hover:file:bg-yellow-500 file:transition-all file:duration-200"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="bg-purple-900 text-white px-6 py-2 rounded hover:bg-purple-800 transition-all duration-200 shadow"
                    >
                      إضافة القطعة
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Parts List */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              {myParts.length === 0 ? (
                <div className="text-center p-8">
                  <Package size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">لم تقم بإضافة أي قطع غيار بعد</p>
                  <button 
                    onClick={() => setShowAddPartForm(true)}
                    className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 shadow font-bold"
                  >
                    إضافة قطعة غيار
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {myParts.map((part) => (
                    <div key={part._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        {part.image ? (
                          <img
                            src={`http://localhost:4000${part.image}`}
                            alt={part.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load part image:', part.image);
                              e.target.src = "https://via.placeholder.com/300x150?text=لا+توجد+صورة";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Package size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-purple-900">{part.name}</h3>
                          <span className="bg-yellow-400 text-indigo-900 px-2 py-1 rounded-full text-xs font-bold">
                            {part.price} دينار
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">موديل: {part.carModel}</p>
                        <p className="text-sm text-gray-600 mb-3">{part.specifications}</p>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            part.condition === 'جديد' 
                              ? 'bg-green-100 text-green-800' 
                              : part.condition === 'مستعمل' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                          }`}>{part.condition}</span>
                          <div className="flex space-x-1">
                            <button 
                              className="p-1 text-gray-500 hover:text-yellow-500"
                              title="تعديل"
                              onClick={() => {
                                // Handle edit part
                                console.log('Edit part:', part._id);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-red-500"
                              title="حذف"
                              onClick={() => {
                                // Handle delete part
                                console.log('Delete part:', part._id);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">الإعدادات</h2>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-purple-900">الخصوصية والأمان</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">تغيير كلمة المرور</h4>
                        <p className="text-sm text-gray-600">تحديث كلمة المرور الخاصة بك</p>
                      </div>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-all duration-200">
                        تغيير
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">التحقق بخطوتين</h4>
                        <p className="text-sm text-gray-600">تأمين حسابك بشكل إضافي</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-900"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">تنبيهات البريد الإلكتروني</h4>
                        <p className="text-sm text-gray-600">استلام إشعارات على بريدك الإلكتروني</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-900"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4 text-purple-900">تفضيلات الحساب</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">اللغة</h4>
                        <p className="text-sm text-gray-600">تغيير لغة التطبيق</p>
                      </div>
                      <select className="bg-gray-100 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">الوضع الليلي</h4>
                        <p className="text-sm text-gray-600">تفعيل وضع الإضاءة المنخفضة</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-900"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">حذف الحساب</h4>
                        <p className="text-sm text-gray-600">حذف حسابك وجميع بياناتك نهائياً</p>
                      </div>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white p-4 text-center text-gray-600 text-sm mt-auto border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} ورشتي - جميع الحقوق محفوظة</p>
        </footer>
      </div>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around">
          {[
            { id: 'profile', label: 'الملف', icon: <User size={20} /> },
            { id: 'bookings', label: 'المواعيد', icon: <Calendar size={20} /> },
            { id: 'parts', label: 'القطع', icon: <Package size={20} /> },
            { id: 'errorCodes', label: 'الأعطال', icon: <History size={20} /> },
            { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 ${
                activeTab === tab.id ? 'text-purple-900' : 'text-gray-500'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}