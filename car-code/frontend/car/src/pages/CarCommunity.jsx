import { useState, useEffect } from 'react';
import { User, Plus, Search ,ArrowLeft} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate, useParams ,Link} from 'react-router-dom';
import PostCard from '../components/PostCard';

axios.defaults.withCredentials = true;

const colors = {
  richPurple: '#5D1D5F',
  deepNavy: '#081840',
  brightYellow: '#FCDE59',
  darkYellow: '#4A4215',
};

export default function CarCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users/me');
        console.log('Current User:', response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast.error('فشل جلب بيانات المستخدم');
      }
    };
    fetchCurrentUser();
    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/posts', { params: { page, limit: 10 } });
      console.log('Fetched Posts:', response.data.posts); // Log عشان نتأكد إن التعليقات بتترجع
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('فشل جلب المنشورات');
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/posts/${id}`);
      console.log('Fetched Post:', response.data.post); // Log عشان نتأكد إن التعليقات بتترجع
      setPost(response.data.post);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('فشل جلب المنشور');
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const response = await axios.post('http://localhost:4000/api/posts', { content: newPostContent });
      setPosts([response.data.post, ...posts]);
      setNewPostContent('');
      setShowNewPostModal(false);
      toast.success('تم إضافة المنشور بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل إضافة المنشور');
    }
  };

  const handleCommentAdd = async (postId, newComment) => {
    if (id) {
      await fetchPost(); // إعادة جلب المنشور لتحديث التعليقات
    } else {
      await fetchPosts(); // إعادة جلب المنشورات لتحديث التعليقات
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
    if (id === postId) navigate('/community');
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (id) {
      await fetchPost();
    } else {
      await fetchPosts();
    }
  };

  const handleLike = async (postId, likes) => {
    if (id) {
      await fetchPost();
    } else {
      await fetchPosts();
    }
  };

  const handleSupportComment = async (postId, commentId, supports) => {
    if (id) {
      await fetchPost();
    } else {
      await fetchPosts();
    }
  };

  const handleReportPost = async (postId) => {
    if (id) {
      await fetchPost();
    } else {
      await fetchPosts();
    }
  };

  const handleReportComment = async (commentId) => {
    if (id) {
      await fetchPost();
    } else {
      await fetchPosts();
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await axios.get('http://localhost:4000/api/posts/search', { params: { query } });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error searching posts:', error);
      toast.error('فشل البحث');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#f8f8fa' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#5D1D5F' }}></div>
        <span className="mr-3 text-gray-700">جارٍ التحميل...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-right" dir="rtl" style={{ backgroundColor: '#f8f8fa' }}>
    <header style={{ backgroundColor: colors.deepNavy }} className="text-white p-4 sticky top-0 z-10 shadow-md">
  <div className="container mx-auto flex items-center justify-between">
    <h1 className="text-2xl font-bold" style={{ color: colors.brightYellow }}>مجتمع السيارات</h1>
    
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث..."
          className="py-2 px-4 pr-10 rounded-full text-white w-64 focus:outline-white focus:ring-2"
          style={{ borderColor: colors.richPurple }}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>
      
      {/* استبدال أيقونة البروفايل بسهم رجوع مع عكس الاتجاه */}
      <Link 
        to="/" // أو المسار الذي تريد الرجوع إليه
        relative="path" 
        className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transform rotate-180" 
        style={{ color: colors.richPurple }}
      >
        <ArrowLeft size={24} />
      </Link>
    </div>
  </div>
</header>
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col w-full gap-6">
          <div className="w-full max-w-3xl mx-auto">
            {!id && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <button
                  className="w-full flex items-center justify-center gap-2 text-white py-2 px-4 rounded-md transition"
                  style={{ backgroundColor: colors.richPurple }}
                  onClick={() => setShowNewPostModal(true)}
                >
                  <Plus size={20} />
                  <span>إضافة منشور جديد</span>
                </button>
              </div>
            )}
            <div className="space-y-6">
              {id ? (
                post && (
                  <PostCard
                    post={post}
                    currentUser={currentUser}
                    onDelete={handleDeletePost}
                    onLike={handleLike}
                    onCommentAdd={handleCommentAdd}
                    onCommentDelete={handleDeleteComment}
                    onCommentSupport={handleSupportComment}
                    onReportPost={handleReportPost}
                    onReportComment={handleReportComment}
                  />
                )
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    onDelete={handleDeletePost}
                    onLike={handleLike}
                    onCommentAdd={handleCommentAdd}
                    onCommentDelete={handleDeleteComment}
                    onCommentSupport={handleSupportComment}
                    onReportPost={handleReportPost}
                    onReportComment={handleReportComment}
                  />
                ))
              )}
              {!id && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    السابق
                  </button>
                  <span>{page} / {totalPages}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page === totalPages}
                  >
                    التالي
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer style={{ backgroundColor: colors.deepNavy }} className="text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2" style={{ color: colors.brightYellow }}>مجتمع السيارات</h2>
              <p className="text-gray-400">المكان الأمثل لمناقشة كل ما يتعلق بالسيارات</p>
            </div>
            <div>
              <ul className="flex gap-4">
                <li><a href="#" className="hover:text-gray-300">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-gray-300">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-gray-300">اتصل بنا</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-400">
            <p>© 2025 مجتمع السيارات - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">إضافة منشور جديد</h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 h-40 focus:outline-none"
              style={{ borderColor: colors.richPurple }}
              placeholder="ما الذي تريد مشاركته؟"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                onClick={() => setShowNewPostModal(false)}
              >
                إلغاء
              </button>
              <button
                className="text-white py-2 px-4 rounded-md"
                style={{ backgroundColor: colors.richPurple }}
                onClick={handleAddPost}
              >
                نشر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}