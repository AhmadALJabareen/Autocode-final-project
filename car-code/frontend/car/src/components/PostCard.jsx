import { Clock, Trash, MessageSquare, ThumbsUp, Heart, Flag, Send, MoreHorizontal, Reply } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const colors = {
  richPurple: '#5D1D5F',
  deepNavy: '#081840',
  darkYellow: '#4A4215',
};

const PostCard = ({ post, currentUser, onDelete, onLike, onCommentAdd, onCommentDelete, onCommentSupport, onReportPost, onReportComment }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState({});

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await axios.post('http://localhost:4000/api/posts/comment', {
        postId: post._id,
        content: commentText,
      });
      onCommentAdd(post._id, response.data.comment);
      setCommentText('');
      toast.success('تم إضافة التعليق بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل إضافة التعليق');
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const response = await axios.post('http://localhost:4000/api/posts/reply', {
        commentId,
        content: replyText,
      });
      onCommentAdd(post._id, response.data.reply); // إعادة جلب البيانات في CarCommunity
      setReplyText('');
      setShowReplyInput({ ...showReplyInput, [commentId]: false });
      toast.success('تم إضافة الرد بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل إضافة الرد');
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${post._id}`);
      onDelete(post._id);
      toast.success('تم حذف المنشور بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل الحذف');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/comment/${commentId}`);
      onCommentDelete(post._id, commentId);
      toast.success('تم حذف التعليق بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل الحذف');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/posts/like/${post._id}`);
      onLike(post._id, response.data.likes);
      toast.success('تم إضافة الإعجاب');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل الإعجاب');
    }
  };

  const handleSupportComment = async (commentId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/posts/support/${post._id}/${commentId}`);
      onCommentSupport(post._id, commentId, response.data.supports);
      toast.success('تم إضافة التأييد');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل التأييد');
    }
  };

  const handleReportPost = async () => {
    try {
      await axios.post(`http://localhost:4000/api/posts/report/${post._id}`);
      onReportPost(post._id);
      toast.success('تم الإبلاغ عن المنشور بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل الإبلاغ');
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await axios.post(`http://localhost:4000/api/posts/report/comment/${commentId}`);
      onReportComment(commentId);
      toast.success('تم الإبلاغ عن التعليق بنجاح');
    } catch (error) {
      toast.error(error.response?.data.message || 'فشل الإبلاغ');
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={`http://localhost:4000${post.userAvatar}`} alt={post.userName} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-bold">{post.userName}</h3>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              <Clock size={14} />
              <span>{new Date(post.createdAt).toLocaleString('ar-EG', { hour12: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-gray-700" onClick={handleReportPost}>
            <Flag size={20} />
          </button>
          {currentUser && post.userId === currentUser._id && (
            <button className="text-red-600 hover:text-red-800" onClick={handleDeletePost}>
              <Trash size={20} />
            </button>
          )}
          <button className="text-gray-500 hover:text-gray-700" onClick={() => navigate(`/community/${post._id}`)}>
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      <p className="mb-4 text-gray-800">{post.content}</p>
      <div className="flex items-center justify-between border-t border-b py-2 mb-4">
        <button className="flex items-center gap-1 text-gray-600" style={{ color: colors.richPurple }} onClick={handleLike}>
          <Heart size={18} />
          <span>{post.likes || 0}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-600" style={{ color: colors.deepNavy }}>
          <MessageSquare size={18} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>
      <div className="space-y-3">
        <h4 className="font-bold text-gray-700">التعليقات</h4>
        {(post.comments || []).map(comment => (
          <div key={comment._id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold ">{comment.userId.name}</span>
              <img src={`http://localhost:4000${comment.userId.image}`} alt="" className="w-10 h-10 rounded-full"/>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString('ar-EG', { hour12: true })}</span>
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            <div className="flex gap-3 text-sm">
              <button
                className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ color: colors.richPurple }}
                onClick={() => handleSupportComment(comment._id)}
              >
                <ThumbsUp size={14} />
                <span>أؤيد ({comment.supports || 0})</span>
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ color: colors.deepNavy }}
                onClick={() => toggleReplyInput(comment._id)}
              >
                <Reply size={14} />
                <span>رد</span>
              </button>
              {currentUser && comment.userId === currentUser._id && (
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded text-red-600"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <Trash size={14} />
                  <span>حذف</span>
                </button>
              )}
              <button
                className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ color: colors.darkYellow }}
                onClick={() => handleReportComment(comment._id)}
              >
                <Flag size={14} />
                <span>إبلاغ</span>
              </button>
            </div>
            {showReplyInput[comment._id] && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="الرد على التعليق..."
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                  style={{ borderColor: colors.richPurple }}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment._id)}
                />
                <button
                  className="text-white p-2 rounded-md"
                  style={{ backgroundColor: colors.richPurple }}
                  onClick={() => handleAddReply(comment._id)}
                >
                  <Send size={18} />
                </button>
              </div>
            )}
            {(comment.replies || []).length > 0 && (
              <div className="mt-3 space-y-2 pl-4 border-r-2 border-gray-200">
                {comment.replies.map(reply => (
                  <div key={reply._id} className="bg-gray-100 p-2 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{reply.userId.name}</span>
                      <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString('ar-EG', { hour12: true })}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            placeholder="أضف تعليقاً..."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            style={{ borderColor: colors.richPurple }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button
            className="text-white p-2 rounded-md"
            style={{ backgroundColor: colors.richPurple }}
            onClick={handleAddComment}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;