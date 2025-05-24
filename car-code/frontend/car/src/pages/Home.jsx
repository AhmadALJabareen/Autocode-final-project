import { useState, useEffect } from "react";
import {
  Search,
  Wrench,
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Car,
  Star,
  Award,
  Shield,
  ArrowUp,
} from "lucide-react";
import axios from "axios"; // إضافة axios
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [topSpareParts, setTopSpareParts] = useState([]); // حالة لقطع الغيار
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  const [codes, setCodes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "كيف أعرف رمز العطل في سيارتي؟",
      answer:
        "يمكنك قراءة رمز العطل عبر جهاز OBD-II أو زيارة أقرب مركز صيانة لمسح الأكواد.",
    },
    {
      question: "هل الخدمة متوفرة في جميع المدن؟",
      answer: "نعم، لدينا ميكانيكيون معتمدون في معظم المدن الرئيسية.",
    },
    {
      question: "ما هي ضمانات قطع الغيار؟",
      answer: "جميع القطع الجديدة لها ضمان لمدة عام، والمستعملة 3 أشهر.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, mechanicsRes, partsRes, codesRes, articlesRes] =
          await Promise.all([
            axios.get("http://localhost:4000/api/admin/users"),
            axios.get("http://localhost:4000/api/admin/mechanics"),
            axios.get("http://localhost:4000/api/admin/parts"),
            axios.get("http://localhost:4000/api/codes"),
            axios.get("http://localhost:4000/api/admin/articles"),
          ]);
        setUsers(usersRes.data.users || []);
        setMechanics(mechanicsRes.data.mechanics || []);
        setParts(partsRes.data || []);
        setCodes(codesRes.data || []);
        console.log(articlesRes.data.articles);
        setArticles(articlesRes.data.articles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقًا.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // جلب البيانات من API
  useEffect(() => {
    const fetchTopParts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:4000/api/parts/approved"
        );
        setTopSpareParts(response.data.parts);
      } catch (err) {
        setError("حدث خطأ أثناء جلب قطع الغيار. حاول مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopParts();

    const timer = setTimeout(() => {
      setIsImageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // تسلسل التقييمات
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "أحمد خالد",
      role: "مالك سيارة تويوتا كامري",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcVXIgWCvTbb55lDj91N_g2rd0F3rma21CA&s",
      content:
        "ساعدني موقع أوتوكود على اكتشاف مشكلة في نظام الوقود كنت أعاني منها لشهور. وجدت الحل بسرعة ووفرت الكثير من المال!",
      rating: 5,
    },
    {
      id: 2,
      name: "فاطمة العلي",
      role: "مالكة سيارة نيسان التيما",
      image:
        "https://i.pinimg.com/736x/7c/7f/cb/7c7fcb47e65fec252042d36326030554.jpg",
      content:
        "الموقع سهل الاستخدام ووفر لي الكثير من الوقت. حجزت ميكانيكي ممتاز عبر التطبيق وأصلح المشكلة في نفس اليوم.",
      rating: 5,
    },
    {
      id: 3,
      name: "محمد العمري",
      role: "ميكانيكي معتمد",
      image:
        "https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg",
      content:
        "كميكانيكي، أوتوكود  ساعدني في زيادة عملائي وتنظيم مواعيدي بشكل أفضل. أنصح به جميع الميكانيكيين!",
      rating: 4,
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#081840]/5 to-[#081840]/10"
    >
      <Navbar />

      {/* Hero Section with Animation */}
      <section className="container mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#081840] mb-6">
            حلول فورية لتشخيص أعطال سيارتك
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            أدخل رمز عطل سيارتك للحصول على تفاصيل المشكلة، الحلول المقترحة، وقطع
            الغيار المتوفرة بدون تسجيل. سجّل الدخول لحجز مواعيد مع ميكانيكيين،
            بيع أو شراء قطع غيار مستعملة، وتتبع صيانة سيارتك.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Wrench className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>تشخيص فوري</span>
            </div>
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>ميكانيكيون معتمدون</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>حجز سهل</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CreditCard className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>دفع آمن</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="/code"
              className="bg-[#5D1D5F] hover:bg-[#5D1D5F]/80 text-white font-medium py-3 px-6 rounded-lg transition duration-300 animate-pulse-slow"
            >
              ابحث عن الأكواد الآن
            </a>
            <a
              href="/booking"
              className="bg-transparent hover:bg-[#FCDE59]/20 text-[#4A4215] font-medium py-3 px-6 border border-[#FCDE59] rounded-lg transition duration-300"
            >
              احجز موعد مع مختص ميكانيك
            </a>
          </div>
        </div>
        <div
          className={`order-1 md:order-2 transition-all duration-1000 transform ${
            isImageLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-[#FCDE59] rounded-full opacity-20 blur-lg animate-pulse"></div>
            <div className="relative bg-white p-2 rounded-xl shadow-2xl overflow-hidden">
              <img
                src="https://img.freepik.com/free-vector/blue-sports-car-isolated-white-vector_53876-67354.jpg?semt=ais_hybrid&w=740"
                alt="واجهة تشخيص السيارة"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg">
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <FileText className="h-4 w-4 ml-2 text-[#5D1D5F]" />
                  <span>نتائج فورية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 bg-white rounded-t-3xl shadow-inner">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#081840]">
          خدماتنا المميزة
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              تشخيص الأعطال
            </h3>
            <p className="text-gray-600">
              أدخل رمز العطل للحصول على تفاصيل المشكلة، الحلول، وقطع الغيار
              المناسبة فوراً.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              حجز ميكانيكي
            </h3>
            <p className="text-gray-600">
              اختر خدمة منزلية أو ورشة، حدد الموقع والوقت، وادفع إلكترونياً
              بسهولة.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Wrench className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              سوق قطع الغيار
            </h3>
            <p className="text-gray-600">
              بيع أو اشترِ قطع غيار مستعملة بأمان مع ضمان الجودة والتوافق.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              ملفات الميكانيكيين
            </h3>
            <p className="text-gray-600">
              استعرض تقييمات الميكانيكيين، مواعيدهم، وقم بحجز موعد بسهولة.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              تتبع الصيانة
            </h3>
            <p className="text-gray-600">
              تابع حالة الحجوزات وسجل الصيانة مع تنبيهات دورية للعناية بسيارتك.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              دفع إلكتروني
            </h3>
            <p className="text-gray-600">
              ادفع بأمان عبر الإنترنت مع إيصال رقمي لكل عملية.
            </p>
          </div>
        </div>
      </section>

      {/* Top Spare Parts Section */}
      <section className="container mx-auto px-4 py-12 bg-[#081840]/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840] mb-3">
            قطع الغيار الأكثر طلبًا
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تصفح قطع الغيار الأكثر شيوعًا وابحث عن ما تحتاجه بأفضل الأسعار
            والجودة.
          </p>
        </div>
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D1D5F] mx-auto"></div>
            <p className="text-gray-600 mt-4">جارٍ تحميل قطع الغيار...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSpareParts.map((part) => (
              <div
                key={part._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="p-2 bg-[#FCDE59]/10 flex justify-center">
                  <img
                    src={`http://localhost:4000${part.image}`}
                    alt={part.name}
                    className="h-32 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#081840]">{part.name}</h3>
                  <div className="text-sm text-gray-500 mb-2">
                    الحالة: {part.condition === "new" ? "جديد" : "مستعمل"}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    نوع السيارة: {part.carModel}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#5D1D5F]">
                      {part.price} دينار
                    </span>
                    <button
                      onClick={() => handleAddToCart(part._id)}
                      className="bg-[#5D1D5F] text-white px-3 py-1 rounded text-sm hover:bg-[#5D1D5F]/80 transition duration-300"
                    >
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <a
            href="/spare-parts"
            className="inline-block bg-[#081840] hover:bg-[#081840]/80 text-white font-medium py-2 px-6 rounded transition duration-300"
          >
            عرض جميع قطع الغيار
          </a>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#081840] text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <Shield className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">
              {mechanics.length}
            </span>
            <span className="text-gray-300">ميكانيكي معتمد</span>
          </div>
          <div className="p-4">
            <Car className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">
              {codes.length}
            </span>
            <span className="text-gray-300">عطل تم تشخيصه</span>
          </div>
          <div className="p-4">
            <User className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">
              {users.length}
            </span>
            <span className="text-gray-300">عميل راضٍ</span>
          </div>
          <div className="p-4">
            <Wrench className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">{parts.total}</span>
            <span className="text-gray-300">قطعة غيار متوفرة</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840] mb-3">
            آراء العملاء
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تعرف على تجارب عملائنا مع أوتو دياج
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonials Container */}
          <div className="relative overflow-hidden h-[400px] md:h-[350px]">
            <div
              className="flex absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
              style={{
                width: `${testimonials.length * 100}%`,
                transform: `translateX(-${
                  activeTestimonial * (100 / testimonials.length)
                }%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full h-full px-4"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <div className="bg-[#081840]/5 rounded-xl p-6 md:p-8 shadow-md h-full flex flex-col">
                    <div className="flex flex-col md:flex-row items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-[#FCDE59]/30 mb-4 md:mb-0 md:ml-4"
                      />
                      <div className="text-center md:text-right">
                        <h3 className="font-bold text-lg text-[#081840]">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {testimonial.role}
                        </p>
                        <div className="flex justify-center md:justify-start space-x-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-[#FCDE59]"
                                  : "text-gray-300"
                              }`}
                              fill={i < testimonial.rating ? "#FCDE59" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic mt-4 flex-grow">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  activeTestimonial === index ? "bg-[#5D1D5F]" : "bg-gray-300"
                }`}
                aria-label={`انتقل إلى التقييم ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-12 bg-[#081840]/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840]">
            نصائح وصيانة
          </h2>
          <p className="text-gray-600">
            مقالات مختارة لمساعدتك في العناية بسيارتك
          </p>
        </div>
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D1D5F] mx-auto"></div>
            <p className="text-gray-600 mt-4">جارٍ تحميل المقالات...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {articles.slice(0, 2).map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={`${article.image}`}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt ||
                      article.content.substring(0, 100) + "..."}
                  </p>
                  <a
                    href={`/articles/${article._id}`} // Link to article details page
                    className="text-[#5D1D5F] font-medium hover:underline"
                  >
                    قراءة المزيد
                  </a>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              <a href="/articles" className="text-center p-6 w-full">
                <div className="text-2xl font-bold text-[#5D1D5F] mb-2">+</div>
                <span className="font-medium">عرض جميع المقالات</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* FAQ Section */}

      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840]">
            أسئلة شائعة
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-4 text-right font-medium bg-gray-50 hover:bg-gray-100 transition duration-300 flex justify-between items-center"
              >
                <span className="text-[#081840]">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-[#5D1D5F] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "max-h-40 opacity-100 p-4"
                    : "max-h-0 opacity-0 p-0"
                } bg-white text-gray-600`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[#5D1D5F] text-white p-3 rounded-full shadow-lg hover:bg-[#4A154B] transition-all duration-300 animate-bounce"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <Footer />
    </div>
  );
}
