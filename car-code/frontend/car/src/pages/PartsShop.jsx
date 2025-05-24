import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import PartModal from '../components/PartModal';
import Cart from '../components/Cart';

// Enable axios to send cookies with requests
axios.defaults.withCredentials = true;

export default function PartsShop() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 8;
  const toastTriggered = useRef(new Set());
  const [hasConditionField, setHasConditionField] = useState(true); // New state to check if condition exists

  // Fetch approved parts
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/parts/approved');
        console.log('API Parts:', response.data.parts);
        setParts(response.data.parts);
        // Check if any part has a condition field
        const conditionExists = response.data.parts.some((part) => part.condition !== undefined);
        setHasConditionField(conditionExists);
        if (!conditionExists) {
          console.warn('No condition field found in parts data');
        }
      } catch (error) {
        console.error('Error fetching parts:', error);
        toast.error('فشل جلب قطع الغيار');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/cart', {
        headers: {},
      });
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data || error.message);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle adding to cart with debounce
  const addToCart = async (part) => {
    const toastId = `${part._id}-${Date.now()}`;
    if (toastTriggered.current.has(toastId)) return;
    toastTriggered.current.add(toastId);

    try {
      await axios.post(
        'http://localhost:4000/api/cart/add',
        { partId: part._id, quantity: 1 },
        { headers: {} }
      );
      await fetchCart();
      toast.success(`تم إضافة ${part.name} إلى السلة`, { toastId });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('فشل إضافة العنصر إلى السلة');
    }

    setTimeout(() => toastTriggered.current.delete(toastId), 1000);
  };

  const debouncedAddToCart = debounce(addToCart, 300);

  // Handle removing from cart
  const removeFromCart = async (partId) => {
    const toastId = `remove-${partId}-${Date.now()}`;
    if (toastTriggered.current.has(toastId)) return;
    toastTriggered.current.add(toastId);

    try {
      await axios.delete(`http://localhost:4000/api/cart/remove/${partId}`, {
        headers: {},
      });
      await fetchCart();
      toast.success('تم إزالة المنتج من السلة', { toastId });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('فشل إزالة العنصر من السلة');
    }

    setTimeout(() => toastTriggered.current.delete(toastId), 1000);
  };

  // Handle opening modal
  const openModal = (part) => {
    setSelectedPart(part);
  };

  // Handle closing modal
  const closeModal = () => {
    setSelectedPart(null);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Filter parts by search query and condition
  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      (part.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (part.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (part.carModel?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCondition =
      conditionFilter === 'all' ||
      ( part.condition === conditionFilter) ||
      !hasConditionField; // If no condition field, ignore condition filter
    return matchesSearch && matchesCondition;
  });

  useEffect(() => {
    console.log('Filtered Parts:', filteredParts);
  }, [filteredParts]);

  // Pagination logic
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);
  const totalPages = Math.ceil(filteredParts.length / partsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate cart item count
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#f9f9f9' }}>
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: '#5D1D5F' }}
        ></div>
        <span className="mr-3 text-gray-700">جارٍ التحميل...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }} dir="rtl">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-40" style={{ backgroundColor: '#081840' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#FCDE59' }}>
              متجر قطع الغيار
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={toggleCart}
                  className="p-2 rounded-full relative transition-colors duration-200"
                  style={{ backgroundColor: '#FCDE59' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e6c94f')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FCDE59')}
                >
                  <ShoppingCart size={20} style={{ color: '#4A4215' }} />
                  {cartItemCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      style={{ backgroundColor: '#5D1D5F' }}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {showCart && (
                  <Cart cart={cart} onClose={() => setShowCart(false)} removeFromCart={removeFromCart} />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar and Filters */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          {/* Compact Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن قطع الغيار..."
              className="w-full pl-4 pr-10 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ '--focus-ring-color': '#5D1D5F' }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Condition Filter */}
          {hasConditionField ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setConditionFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  conditionFilter === 'all'
                    ? 'bg-[#5D1D5F] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => {
                  setConditionFilter('جديد');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  conditionFilter === 'جديد'
                    ? 'bg-[#5D1D5F] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                جديد
              </button>
              <button
                onClick={() => {
                  setConditionFilter('مستعمل');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  conditionFilter === 'مستعمل'
                    ? 'bg-[#5D1D5F] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                مستعمل
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">فلتر الحالة غير متوفر حالياً</p>
          )}
        </div>

        {/* Parts Grid */}
        {currentParts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">لا توجد قطع غيار مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentParts.map((part) => (
              <div
                key={part._id}
                onClick={() => openModal(part)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={part.image ? `http://localhost:4000${part.image}` : 'https://via.placeholder.com/400/300'}
                    alt={part.name || 'جزء غير معروف'}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: '#FCDE59', color: '#4A4215' }}
                    >
                      {part.condition ? (part.condition === 'جديد' ? 'جديد' : 'مستعمل') : 'غير محدد'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 truncate">{part.name || 'جزء غير معروف'}</h2>
                  <p className="text-gray-600 text-sm mb-2 truncate">{part.carModel || 'غير محدد'}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold" style={{ color: '#5D1D5F' }}>
                      {part.price ? `${part.price} دينار` : 'السعر غير متوفر'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        debouncedAddToCart(part);
                      }}
                      className="p-2 rounded-full transition-colors duration-200"
                      style={{ backgroundColor: '#FCDE59' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e6c94f')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FCDE59')}
                    >
                      <ShoppingCart size={16} style={{ color: '#4A4215' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-full transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FCDE59] text-[#4A4215] hover:bg-[#e6c94f]'
                }`}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1.5 rounded-full transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-[#5D1D5F] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-full transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FCDE59] text-[#4A4215] hover:bg-[#e6c94f]'
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPart && (
        <PartModal part={selectedPart} onClose={closeModal} onAddToCart={debouncedAddToCart} />
      )}
    </div>
  );
}