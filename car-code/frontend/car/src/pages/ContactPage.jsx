import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/contact/submit', formData);
      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#081840] mb-4">تواصل معنا</h1>
            <p className="text-lg text-[#5D1D5F] max-w-2xl mx-auto">
              نحن هنا لمساعدتك! سواء كان لديك سؤال عن سياراتنا أو تحتاج إلى دعم، فريقنا على استعداد للرد عليك.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#FCDE59]">
              <h2 className="text-2xl font-semibold text-[#4A4215] mb-6">معلومات التواصل</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#081840] text-white rounded-full"><FaPhone className="text-xl" /></div>
                  <div><h3 className="text-lg font-medium text-[#5D1D5F]">الهاتف</h3><p className="text-gray-600">+962 78666666</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#081840] text-white rounded-full"><FaEnvelope className="text-xl" /></div>
                  <div><h3 className="text-lg font-medium text-[#5D1D5F]">البريد الإلكتروني</h3><p className="text-gray-600">info@carsite.com</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#081840] text-white rounded-full"><FaMapMarkerAlt className="text-xl" /></div>
                  <div><h3 className="text-lg font-medium text-[#5D1D5F]">العنوان</h3><p className="text-gray-600">عمان الاردن</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#081840] text-white rounded-full"><FaCar className="text-xl" /></div>
                  <div><h3 className="text-lg font-medium text-[#5D1D5F]">ساعات العمل</h3><p className="text-gray-600">الأحد - الخميس: 8 ص - 5 م</p></div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#5D1D5F]">
              <h2 className="text-2xl font-semibold text-[#4A4215] mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#5D1D5F] mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE59]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#5D1D5F] mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE59]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#5D1D5F] mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE59]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#5D1D5F] mb-1">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE59]"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#5D1D5F] text-white font-medium rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4A174B]'}`}
                  >
                    <FaPaperPlane />
                    {loading ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-12 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#4A4215] mb-6 text-center">موقعنا على الخريطة</h2>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.665483222873!2d35.90664587562955!3d31.969970674011307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca12ce1b9c62b%3A0x21b9b701f3f4ee86!2sOrange%20Coding%20Academy!5e0!3m2!1sen!2sjo!4v1747481923601!5m2!1sen!2sjo"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;