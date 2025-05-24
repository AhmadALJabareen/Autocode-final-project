import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/articles');
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen justify-center items-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      <Navbar/>
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#081840] mb-8 text-center">المقالات</h1>
          {articles.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد مقالات متاحة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <div key={article._id} className="bg-white rounded-lg shadow-lg p-6">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-[#5D1D5F] mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{article.content.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <FileText size={16} />
                    <span>{new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
                    <span>-</span>
                    <span>{article.author}</span>
                  </div>
                  <Link
                    to={`/articles/${article._id}`}
                    className="inline-block bg-[#5D1D5F] text-white px-4 py-2 rounded-md hover:bg-[#4A174B] transition"
                  >
                    اقرأ المزيد
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer/>
    </div>
  );
}