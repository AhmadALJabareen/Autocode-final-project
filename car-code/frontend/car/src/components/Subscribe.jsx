import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    setSelectedPlan(plan);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/codes/checkout', { plan });
      const { sessionId } = response.data;
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('فشل عملية الاشتراك. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'الاشتراك الشهري',
      price: '5 دينار',
      description: 'وصول غير محدود لجميع أكواد الأعطال',
      features: [
        'البحث في قاعدة البيانات كاملة',
        'عرض الحلول المقترحة',
        'القطع الإحتياطية الموصى بها',
        'تجديد تلقائي كل شهر'
      ],
      buttonColor: 'bg-[#5D1D5F] hover:bg-[#4A154B]',
      popular: false
    },
    {
      id: 'yearly',
      name: 'الاشتراك السنوي',
      price: '50 دينار',
      description: 'وفر 16% مع الاشتراك السنوي',
      features: [
        'كل ميزات الاشتراك الشهري',
        'توفير أكثر من 10 دينار سنوياً',
        'دعم فني متاح',
        'تجديد تلقائي كل سنة'
      ],
      buttonColor: 'bg-[#FCDE59] hover:bg-[#E8CA4D] text-[#4A4215]',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#081840] flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#4A4215]">خطط الاشتراك</h1>
        <p className="text-center text-white mb-8">اختر الخطة التي تناسبك واستمتع بجميع الميزات</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-2 border-[#FCDE59]' : 'border border-gray-200'}`}
            >
              {plan.popular && (
                <div className="bg-[#FCDE59] text-[#4A4215] text-center py-1 font-medium">
                  الأكثر توفيراً
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#5D1D5F] mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#4A4215]">{plan.price}</span>
                  {plan.id === 'yearly' && (
                    <span className="text-gray-500 text-sm mr-2"> / سنة</span>
                  )}
                  {plan.id === 'monthly' && (
                    <span className="text-gray-500 text-sm mr-2"> / شهر</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-[#5D1D5F] ml-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${plan.buttonColor} ${
                    loading && selectedPlan === plan.id ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading && selectedPlan === plan.id ? 'جاري التحميل...' : 'اشترك الآن'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>يمكنك إلغاء الاشتراك في أي وقت. جميع الأسعار تشمل الضريبة.</p>
        </div>
      </div>
    </div>
  );
}