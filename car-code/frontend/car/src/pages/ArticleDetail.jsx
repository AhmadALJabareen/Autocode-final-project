import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/articles/${id}`);
        setArticle(response.data.article);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('فشل تحميل المقال. حاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen justify-center items-center">جارٍ التحميل...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-gray-500">المقال غير موجود.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/articles"
            className="inline-block mb-6 text-[#5D1D5F] hover:underline flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            العودة إلى المقالات
          </Link>
          
          <article className="bg-white rounded-lg shadow-lg p-8">
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-md mb-6"
              />
            )}
            <h1 className="text-3xl font-bold text-[#081840] mb-4">{article.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <FileText size={16} />
              <span>{new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
              <span>-</span>
              <span>{article.author}</span>
            </div>
            <div className="prose prose-lg text-gray-700">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}