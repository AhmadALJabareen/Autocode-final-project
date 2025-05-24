import { ShoppingCart, X } from 'lucide-react';

export default function PartModal({ part, onClose, onAddToCart }) {
  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-8">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={part.image ? `http://localhost:4000${part.image}` : 'https://via.placeholder.com/300/300'}
            alt={part.name}
            className="w-full md:w-1/2 h-52 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{part.name}</h2>
            <div className="space-y-2 mb-4">
              <p className="text-lg font-semibold" style={{ color: '#5D1D5F' }}>
                {part.price} دينار
              </p>
              <p className="text-sm text-gray-600">{part.description}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">موديل السيارة:</span> {part.carModel}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">البائع:</span> {part.user?.name || 'غير معروف'}
              </p>
            </div>
            <button
              onClick={() => {
                onAddToCart(part);
                onClose();
              }}
              className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: '#5D1D5F', color: 'white' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4a1749')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5D1D5F')}
            >
              <ShoppingCart size={18} />
              إضافة إلى السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}