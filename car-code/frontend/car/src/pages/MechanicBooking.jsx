import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star, Package, X, Home, Wrench, Briefcase, Clock, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

export default function MechanicBooking() {
  const [mechanics, setMechanics] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingData, setBookingData] = useState({
    slotId: '',
    serviceType: 'home',
    location: '',
    notes: '',
  });
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:4000/api/users/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error)
      }
    };
    checkAuth();
  }, []);

  // Fetch mechanics
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mechanic');
        console.log('Mechanics Response:', response.data);
        setMechanics(response.data.filter((m) => m.available));

        // Fetch available slots for each mechanic
        const slotsPromises = response.data.map(async (mechanic) => {
          try {
            const slotsResponse = await axios.get(`http://localhost:4000/api/slots/mechanic/${mechanic._id}`);
            return { mechanicId: mechanic._id, slots: slotsResponse.data.slots };
          } catch (error) {
            console.error(`Fetch Slots Error for Mechanic ${mechanic._id}:`, error.message);
            return { mechanicId: mechanic._id, slots: [] };
          }
        });
        const slotsData = await Promise.all(slotsPromises);
        const slotsMap = slotsData.reduce((acc, { mechanicId, slots }) => {
          acc[mechanicId] = slots;
          return acc;
        }, {});
        setAvailableSlots(slotsMap);
      } catch (error) {
        console.error('Fetch Mechanics Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        toast.error('فشل جلب الميكانيكيين');
        setMechanics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanics();
  }, []);

  // Handle booking form changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    console.log('handleBookingSubmit called with bookingData:', bookingData);
    console.log('selectedMechanic:', selectedMechanic);
    if (!isAuthenticated) {
      toast.error('الرجاء تسجيل الدخول لحجز موعد');
      navigate('/login');
      return;
    }

    if (!bookingData.slotId || !bookingData.serviceType || !bookingData.location) {
      toast.error('الرجاء إدخال كل الحقول المطلوبة');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/bookings/book', {
        mechanicId: selectedMechanic._id,
        serviceType: bookingData.serviceType,
        location: bookingData.location,
        slotId: bookingData.slotId,
        notes: bookingData.notes,
        date: availableSlots[selectedMechanic._id]?.find(slot => slot._id === bookingData.slotId)?.date,
        time: availableSlots[selectedMechanic._id]?.find(slot => slot._id === bookingData.slotId)?.time
      });
      console.log('Booking Response:', response.data);
      toast.success('تم حجز الموعد بنجاح! في انتظار موافقة الميكانيكي');
      setShowBookingModal(false);
      setBookingData({ slotId: '', serviceType: 'home', location: '', notes: '' });
      navigate('/');
    } catch (error) {
      console.error('Booking Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل الحجز: ${error.response?.data?.message || 'خطأ غير معروف'}`);
    }
  };

  // Open booking modal
  const openBookingModal = (mechanic) => {
    if (!isAuthenticated) {
      toast.error('الرجاء تسجيل الدخول لحجز موعد');
      navigate('/login');
      return;
    }
    setSelectedMechanic(mechanic);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex-grow py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#081840] mb-3">الميكانيكيون المتاحون</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">احجز موعدًا مع أفضل الميكانيكيين المتخصصين لإصلاح سيارتك في المكان والزمان المناسبين لك</p>
        </div>

        {/* Mechanics List */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-[#FCDE59] border-t-[#081840] rounded-full animate-spin"></div>
          </div>
        ) : mechanics.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
            <Package size={48} className="text-[#5D1D5F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#081840] mb-2">لا يوجد ميكانيكيون متاحون</h3>
            <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الدعم الفني للمساعدة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="h-32 bg-gradient-to-r from-[#081840] to-[#5D1D5F] relative">
                  <div className="absolute -bottom-10 inset-x-0 flex justify-center">
                    <img
                      src={
                        mechanic.user?.image
                          ? `http://localhost:4000${mechanic.user.image}`
                          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6z_d9lGWm6fHIBphcR95mlF8YWN-_38oug&s'
                      }
                      alt={mechanic.user?.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white"
                      onError={(e) => (e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6z_d9lGWm6fHIBphcR95mlF8YWN-_38oug&s')}
                    />
                  </div>
                </div>
                
                <div className="pt-12 px-6 pb-6">
                  <h2 className="text-xl font-bold text-center text-[#081840] mb-4">{mechanic.user?.name}</h2>
                  
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center bg-[#FCDE59]/20 px-3 py-1 rounded-full">
                      <Star size={18} className="text-[#FCDE59] ml-1" />
                      <span className="font-medium text-[#4A4215]">
                        {mechanic.ratings?.length ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1) : 'جديد'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-700 flex items-center">
                      <Wrench size={18} className="ml-2 text-[#5D1D5F]" />
                      <span className="font-medium">الورشة:</span> {mechanic.workshopName || 'غير محدد'}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <MapPin size={18} className="ml-2 text-[#5D1D5F]" />
                      <span className="font-medium">الموقع:</span> {mechanic.user?.location || 'غير محدد'}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Package size={18} className="ml-2 text-[#5D1D5F]" />
                      <span className="font-medium">السعر: </span> {`${mechanic.pricing.homeService} دينار `}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => openBookingModal(mechanic)}
                    disabled={!(availableSlots[mechanic._id]?.length > 0)}
                    className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-300 ${
                      availableSlots[mechanic._id]?.length > 0
                        ? 'bg-gradient-to-r from-[#081840] to-[#5D1D5F] hover:from-[#5D1D5F] hover:to-[#081840] shadow-md hover:shadow-lg'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar size={18} className="ml-2" />
                    {availableSlots[mechanic._id]?.length > 0 ? 'حجز موعد' : 'لا توجد مواعيد متاحة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedMechanic && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md animate-fadeIn">
              <div className="bg-gradient-to-r from-[#081840] to-[#5D1D5F] px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">حجز موعد مع {selectedMechanic.user?.name}</h2>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-white hover:text-[#FCDE59] transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <Calendar size={18} className="ml-2 text-[#5D1D5F]" />
                    اختر الموعد المناسب
                  </label>
                  <select
                    name="slotId"
                    value={bookingData.slotId}
                    onChange={handleBookingChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D1D5F] bg-white"
                  >
                    <option value="">-- اختر موعدًا --</option>
                    {(availableSlots[selectedMechanic._id] || []).map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {new Date(slot.date).toLocaleDateString('ar-EG')} - {slot.time}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <Home size={18} className="ml-2 text-[#5D1D5F]" />
                    نوع الخدمة
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'home' }))}
                      className={`flex items-center justify-center py-3 px-4 rounded-lg border ${
                        bookingData.serviceType === 'home'
                          ? 'bg-[#FCDE59]/20 border-[#FCDE59] text-[#4A4215]'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Home size={18} className="ml-2" />
                      في المنزل
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'workshop' }))}
                      className={`flex items-center justify-center py-3 px-4 rounded-lg border ${
                        bookingData.serviceType === 'workshop'
                          ? 'bg-[#FCDE59]/20 border-[#FCDE59] text-[#4A4215]'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Wrench size={18} className="ml-2" />
                      في الورشة
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <MapPin size={18} className="ml-2 text-[#5D1D5F]" />
                    الموقع / العنوان
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={bookingData.location}
                    onChange={handleBookingChange}
                    placeholder={bookingData.serviceType === 'home' ? "أدخل عنوان المنزل بالتفصيل" : "أدخل موقع التقاء بالورشة"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D1D5F]"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <FileText size={18} className="ml-2 text-[#5D1D5F]" />
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="اذكر تفاصيل المشكلة أو أي ملاحظات إضافية للميكانيكي"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D1D5F] min-h-24"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleBookingSubmit}
                    className="w-full py-3 bg-gradient-to-r from-[#081840] to-[#5D1D5F] hover:from-[#5D1D5F] hover:to-[#081840] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar size={18} className="ml-2" />
                    تأكيد الحجز
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}