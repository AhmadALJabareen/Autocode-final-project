import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#f9f9f9' }} dir="rtl">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#5D1D5F' }}>
          تم الدفع بنجاح!
        </h1>
        <p className="text-gray-700 mb-4">شكرًا لشرائك. تمت عملية الدفع بنجاح.</p>
        <button
          onClick={() => navigate('/spare-parts')}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          العودة إلى قطع الغيار
        </button>
      </div>
    </div>
  );
}