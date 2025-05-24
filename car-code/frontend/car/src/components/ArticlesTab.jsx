
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ArticlesTab({ articles, handleAddArticle }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleAddArticle(formData);
      setFormData({ title: '', content: '', image: '' });
    } catch (error) {
      toast.error('فشل إضافة المقال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FileText size={24} className="ml-2" />
        إدارة المقالات
      </h2>

      {/* نموذج إضافة مقال */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">إضافة مقال جديد</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              عنوان المقال
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D1D5F]"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              محتوى المقال
            </label>
            <textarea
              id="content"
              name="content"
              rows="6"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D1D5F]"
            ></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              رابط الصورة (اختياري)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D1D5F]"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#5D1D5F] text-white font-medium rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4A174B]'
              }`}
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة المقال'}
            </button>
          </div>
        </form>
      </div>

      {/* قائمة المقالات */}
      <div>
        <h3 className="text-lg font-semibold mb-4">المقالات الحالية</h3>
        {articles.length === 0 ? (
          <p className="text-gray-500">لا توجد مقالات بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-right">العنوان</th>
                  <th className="py-3 px-4 text-right">التاريخ</th>
                  <th className="py-3 px-4 text-right">الكاتب</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{article.title}</td>
                    <td className="py-3 px-4">{new Date(article.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="py-3 px-4">{article.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}