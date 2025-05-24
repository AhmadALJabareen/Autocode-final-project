export default function Footer() {
    return (
      <footer className="bg-[#081840] text-white py-8">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-lg">أوتوكود</h3>
            <p className="text-gray-300">
              نقدم أفضل الحلول لتشخيص أعطال السيارات وصيانة المركبات بسهولة وأمان.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-[#FCDE59] transition duration-300">الرئيسية</a></li>
              <li><a href="/contact" className="hover:text-[#FCDE59] transition duration-300">تواصل معنا</a></li>
              <li><a href="/spare-parts" className="hover:text-[#FCDE59] transition duration-300">متجر قطع الغيار</a></li>
              <li><a href="/mechanics" className="hover:text-[#FCDE59] transition duration-300">الميكانيكيون</a></li>
              <li><a href="/articles" className="hover:text-[#FCDE59] transition duration-300">المقالات</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">تواصل معنا</h3>
            <ul className="space-y-2">
              <li><a href="tel:+966000000000" className="hover:text-[#FCDE59] transition duration-300">0799999999999</a></li>
              <li><a href="mailto:info@autodiag.com" className="hover:text-[#FCDE59] transition duration-300">info@autocode.com</a></li>
              <li><span className="text-gray-300">  عمان الاردن</span></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} أوتوكود. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    );
  }