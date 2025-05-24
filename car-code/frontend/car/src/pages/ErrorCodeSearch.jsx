import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

export default function ErrorCodeSearch() {
  const [errorCode, setErrorCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:4000/api/users/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      }
    };
    checkAuth();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!errorCode.trim()) {
      toast.error('الرجاء إدخال كود العطل');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/codes/search', {
        code: errorCode.toUpperCase(),
      });
      console.log('Error Code Response:', response.data);

      setResult(response.data);

      if (isAuthenticated) {
        console.log('Code should be saved to history by backend:', errorCode);
      }
    } catch (error) {
      console.error('Search Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      setResult(null);
      if (error.response?.status === 403 && error.response?.data?.action === 'subscribe') {
        toast.error('لقد استنفدت بحثاتك المجانية. سيتم توجيهك لاختيار الاشتراك...', {
          onClose: () => navigate('/subscribe'),
          autoClose: 3000,
        });
      } else {
        toast.error(`فشل البحث: ${error.response?.data?.message || 'كود العطل غير موجود'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Navbar/>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full  md:flex-row items-center justify-center gap-3 mb-6"> 
        <h1 className="text-2xl font-bold text-center mb-6 text-[#4A4215]">البحث عن كود العطل</h1>

        {/* Search Input */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value.toUpperCase())}
            placeholder="أدخل كود العطل (مثل P0420)"
            className="flex-1 p-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#5D1D5F] text-[#4A4215]"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`p-3 bg-[#5D1D5F] text-white rounded-l-lg hover:bg-[#4A4215] flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Search size={20} />
            <span className="mr-2">بحث</span>
          </button>
        </div>

        {/* Result */}
        {loading ? (
          <div className="text-center">
            <p className="text-[#4A4215]">جارٍ البحث...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#5D1D5F]">كود العطل: {result.code}</h2>
            </div>
            <div>
              <h3 className="font-semibold text-[#4A4215]">المشكلة:</h3>
              <p className="text-gray-700">{result.problem || 'غير متوفر'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#4A4215]">الحل:</h3>
              <p className="text-gray-700">{result.solution || 'غير متوفر'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#4A4215]">القطع المقترحة:</h3>
              {result.suggestedParts && result.suggestedParts.length > 0 ? (
                <div className="space-y-4">
                  {result.suggestedParts.map((part) => (
                    <div key={part.id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="h-24 w-24 bg-[#FCDE59] rounded-md flex items-center justify-center">
                        <Package size={24} className="text-[#4A4215]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#5D1D5F]">{part.name}</p>
                        <p className="text-[#4A4215]">السعر: {part.price} دينار</p>
                        <p className="text-[#4A4215]">الحالة: {part.condition}</p>
                        <p className="text-[#4A4215]">
                          التوفر: {part.available ? 'متوفر' : 'غير متوفر'}
                        </p>
                        {part.available && (
                          <button
                            onClick={() => navigate(`/parts/${part.id}`)}
                            className="text-[#5D1D5F] hover:underline font-medium"
                          >
                            عرض القطعة
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#4A4215] flex items-center">
                  <AlertCircle size={18} className="ml-2 text-[#5D1D5F]" />
                  لا توجد قطع مقترحة
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-[#4A4215] flex items-center justify-center">
            <Package size={24} className="ml-2" />
            <p>أدخل كود العطل لعرض التفاصيل</p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}