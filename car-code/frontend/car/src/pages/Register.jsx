import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', formData);
      
      await Swal.fire({
        title: 'تم التسجيل بنجاح!',
        text: 'تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.',
        icon: 'success',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#5D1D5F',
      });
      
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      setError(errorMsg);
      
      await Swal.fire({
        title: 'خطأ!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#5D1D5F',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#081840] py-8">
      <div className={`w-full max-w-md ${animateIn ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">تسجيل حساب جديد</h1>
          <p className="text-gray-300 mt-2">انشئ حسابك للوصول إلى جميع الميزات</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 text-right"
          dir="rtl"
        >
          {error && (
            <div className="mb-4 p-3 rounded bg-[#5D1D5F]/30 text-white text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-6"> {/* زيادة المسافة بين الحقول */}
            <div className="relative">
              <label className="block text-[#FCDE59] text-sm mb-1"> {/* تغيير إلى label عادي */}
                الاسم الكامل
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all"
                required 
              />
            </div>

            <div className="relative">
              <label className="block text-[#FCDE59] text-sm mb-1">
                البريد الإلكتروني
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all"
                required 
              />
            </div>

            <div className="relative">
              <label className="block text-[#FCDE59] text-sm mb-1">
                كلمة المرور
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all"
                required 
              />
            </div>

            <div className="relative">
              <label className="block text-[#FCDE59] text-sm mb-1">
                رقم الهاتف
              </label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all"
                required 
              />
            </div>

            <div className="relative">
              <label className="block text-[#FCDE59] text-sm mb-1">
                الموقع
              </label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all"
                required 
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`
              w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 
              relative overflow-hidden group mt-8
              ${isLoading ? 'bg-[#5D1D5F]/70' : 'bg-[#5D1D5F] hover:scale-105'} 
              text-[#FCDE59] focus:outline-none
            `}
            disabled={isLoading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCDE59]/30 to-transparent 
              opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full 
              transition-all duration-500"></span>
            
            <span className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#FCDE59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التسجيل...
                </>
              ) : (
                'تسجيل'
              )}
            </span>
          </button>
          
          <p className="mt-6 text-center text-gray-300">
            لديك حساب بالفعل؟{" "}
            <a 
              href="/login" 
              className="text-[#FCDE59] font-bold hover:underline transition-all"
            >
              تسجيل الدخول
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;