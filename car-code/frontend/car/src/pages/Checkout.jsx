import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const createPaypalOrder = async () => {
      try {
        // إنشاء طلب PayPal
        const response = await axios.post(
          'http://localhost:4000/api/orders/create-paypal-order',
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const { paypalOrderId } = response.data;
        console.log('Created PayPal Order ID from backend:', paypalOrderId);

        // جلب رابط الدفع (payer-action) من الـ backend
        const orderDetails = await axios.get(
          `http://localhost:4000/api/orders/get-paypal-order/${paypalOrderId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const payerActionLink = orderDetails.data.links.find(
          (link) => link.rel === 'payer-action'
        )?.href;
        if (!payerActionLink) {
          throw new Error('Payer action link not found');
        }

        console.log('Payer action URL:', payerActionLink);

        // عمل redirect مباشرة لرابط الدفع
        window.location.href = payerActionLink;
      } catch (error) {
        console.error('Error creating PayPal order:', error.response?.data || error.message);
        toast.error('فشل إنشاء طلب الدفع');
        navigate('/spare-parts');
      } finally {
        setLoading(false);
      }
    };

    createPaypalOrder();
  }, [navigate]);

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
    <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#f9f9f9' }} dir="rtl">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#5D1D5F' }}>
          إتمام الدفع
        </h1>
        <p className="text-gray-700">جارٍ تحويلك إلى صفحة الدفع...</p>
      </div>
    </div>
  );
}