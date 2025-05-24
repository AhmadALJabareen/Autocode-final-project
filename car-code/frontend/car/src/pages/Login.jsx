import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/login', formData);
      
      await Swal.fire({
        title: 'تم تسجيل الدخول بنجاح!',
        icon: 'success',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#5D1D5F',
      });
      
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل تسجيل الدخول';
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
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-gray-300 mt-2">سجل دخولك للوصول إلى حسابك</p>
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
              <input 
                type="email" 
                name="email" 
                placeholder=" "
                value={formData.email} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all peer"
                required 
              />
              <label className="absolute right-0 -top-4 text-[#FCDE59] text-xs transition-all duration-300">
                البريد الإلكتروني
              </label>
              <div className="h-4"></div> {/* مسافة إضافية تحت الحقل */}
            </div>

            <div className="relative">
              <input 
                type="password" 
                name="password" 
                placeholder=" "
                value={formData.password} 
                onChange={handleChange}
                className="w-full p-3 bg-transparent border-b-2 border-[#FCDE59]/50 text-gray-200 focus:outline-none focus:border-[#FCDE59] transition-all peer"
                required 
              />
              <label className="absolute right-0 -top-4 text-[#FCDE59] text-xs transition-all duration-300">
                كلمة المرور
              </label>
              <div className="h-4"></div> {/* مسافة إضافية تحت الحقل */}
            </div>
          </div>

          <button 
            type="submit"
            className={`
              w-full mt-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 
              relative overflow-hidden group
              ${isLoading ? 'bg-[#5D1D5F]/70' : 'bg-[#5D1D5F] hover:scale-105'} 
              text-[#FCDE59] focus:outline-none
            `}
            disabled={isLoading}
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCDE59]/30 to-transparent 
              opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full 
              transition-all duration-500"></span>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#FCDE59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الدخول...
                </>
              ) : (
                'دخول'
              )}
            </span>
          </button>
          
          <p className="mt-6 text-center text-gray-300"> {/* زيادة المسافة */}
            ليس لديك حساب؟{" "}
            <a 
              href="/register" 
              className="text-[#FCDE59] font-bold hover:underline transition-all"
            >
              إنشاء حساب
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;