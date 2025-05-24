import { useState, useEffect } from 'react';
import { Settings, LogOut, UserCircle, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/me', {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        console.log(error);
      }
    };
    verifyToken();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-[#051535] to-[#081840] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <Settings className="h-7 w-7 text-[#FCDE59] animate-pulse" />
          <span className="text-2xl font-bold text-white tracking-wider">أوتوكود</span>
        </div>

        {/* Desktop Menu - Updated for Tablet */}
        <div className="hidden lg:flex space-x-8 space-x-reverse">
          <Link to="/" className="text-white hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            الرئيسية
          </Link>
          <Link to="/contact" className="text-white hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            تواصل معنا
          </Link>
          <Link to="/spare-parts" className="text-white hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            متجر قطع الغيار
          </Link>
          <Link to="/booking" className="text-white hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            الميكانيكيون
          </Link>
          <Link to="/articles" className="text-white mx-4 hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            المقالات
          </Link>
          <Link to="/community" className="text-white mx-4 hover:text-[#FCDE59] font-medium transition-all duration-300 hover:scale-105 pb-1 border-b-2 border-transparent hover:border-[#FCDE59]">
            المجتمع
          </Link>
        </div>

        {/* Desktop Section - Updated for Tablet */}
        <div className="hidden lg:flex items-center space-x-5 space-x-reverse">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 space-x-reverse focus:outline-none bg-[#0a1d4a] hover:bg-[#0c2357] rounded-full px-4 py-2 transition-all duration-300"
              >
                <span className="text-white font-medium">{user?.name}</span>
                <UserCircle className="h-5 w-5 text-[#FCDE59]" />
                <ChevronDown className={`h-4 w-4 text-[#FCDE59] transition-transform duration-300 ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border-t-2 border-[#FCDE59] transform transition-all duration-300 ml-2">
                  {user?.role === 'user' && (
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-[#081840] transition-colors duration-300"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserCircle className="h-5 w-5 ml-2 text-gray-500" />
                      الملف الشخصي
                    </Link>
                  )}
                  {(user?.role === 'mechanic' || user?.role === 'admin') && (
                    <Link
                      to={user?.role === 'mechanic' ? '/mechanic' : '/admin'}
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-[#081840] transition-colors duration-300"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="h-5 w-5 ml-2 text-gray-500" />
                      {user?.role === 'mechanic' ? 'لوحة التحكم' : 'لوحة الإدارة'}
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-right px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-red-600 transition-colors duration-300"
                  >
                    <LogOut className="h-5 w-5 ml-2 text-gray-500" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-transparent hover:bg-[#FCDE59]/10 text-white hover:text-[#FCDE59] font-medium py-2 px-5 border border-[#FCDE59] rounded-full transition-all duration-300"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-[#5D1D5F] hover:bg-[#6E2270] text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Tablet/Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-white hover:text-[#FCDE59] focus:outline-none transition-transform duration-300 hover:scale-110">
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1d4a] px-5 py-3 shadow-inner transition-all duration-500 animate-fadeIn">
          <div className="flex flex-col space-y-3 text-right">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
            >
              الرئيسية
            </Link>
            <Link
              to="/diagnose"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
            >
              تشخيص الأعطال
            </Link>
            <Link
              to="/spare-parts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
            >
              متجر قطع الغيار
            </Link>
            <Link
              to="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
            >
              الميكانيكيون
            </Link>
            <Link
              to="/articles"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
            >
              المقالات
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                {user?.role === 'user' && (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-end text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
                  >
                    <span className="ml-2">الملف الشخصي</span>
                    <UserCircle className="h-5 w-5" />
                  </Link>
                )}
                {(user?.role === 'mechanic' || user?.role === 'admin') && (
                  <Link
                    to={user?.role === 'mechanic' ? '/mechanic' : '/admin'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-end text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-[#FCDE59] pr-3"
                  >
                    <span className="ml-2">{user?.role === 'mechanic' ? 'لوحة التحكم' : 'لوحة الإدارة'}</span>
                    <Settings className="h-5 w-5" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-end text-white hover:text-red-400 font-medium py-2 transition duration-300 border-r-4 border-transparent hover:border-red-400 pr-3"
                >
                  <span className="ml-2">تسجيل الخروج</span>
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-700 my-3"></div>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-transparent border border-[#FCDE59] text-white text-center font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-[#5D1D5F] text-white text-center font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}