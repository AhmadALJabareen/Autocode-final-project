import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart({ cart, onClose, removeFromCart }) {
  const totalPrice = cart.reduce((total, item) => total + item.partId.price * item.quantity, 0);

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-end z-50 transition-opacity duration-300">
      <div 
        className="bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-xl transform transition-transform duration-300"
        style={{ boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#5D1D5F]">
            عربة التسوق
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="إغلاق السلة"
          >
            <X size={24} />
          </button>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-3/4">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">سلة التسوق فارغة</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#5D1D5F] text-white rounded-lg hover:bg-[#4a1749] transition-colors"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={item.partId._id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <img
                  src={
                    item.partId.image
                      ? `http://localhost:4000${item.partId.image}`
                      : '/placeholder-part.jpg'
                  }
                  alt={item.partId.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = '/placeholder-part.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.partId.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.partId.carModel}</p>
                  <p className="text-[#5D1D5F] font-bold mt-2">
                    {item.partId.price} ر.س × {item.quantity} ={' '}
                    {(item.partId.price * item.quantity).toFixed(2)} دينار
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.partId._id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
                  aria-label="إزالة من السلة"
                >
                  <X size={18} />
                </button>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">المجموع:</span>
                <span className="text-xl font-bold text-[#5D1D5F]">{totalPrice.toFixed(2)} دينار</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-3 px-4 text-center rounded-lg bg-[#5D1D5F] text-white font-medium hover:bg-[#4a1749] transition-colors shadow-md hover:shadow-lg"
              >
                إتمام عملية الشراء
              </Link>

              <button
                onClick={onClose}
                className="block w-full py-2 px-4 text-center mt-3 text-[#5D1D5F] hover:text-[#4a1749] transition-colors"
              >
                أو تابع التسوق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}