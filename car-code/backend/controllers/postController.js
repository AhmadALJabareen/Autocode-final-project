const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { content } = req.body;
    const user = await User.findById(req.user.id).select('name image');
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const post = new Post({
      userId: req.user.id,
      content,
    });
    await post.save();

    res.status(201).json({
      message: 'تم إضافة المنشور بنجاح',
      post: {
        ...post.toObject(),
        userName: user.name,
        userAvatar: user.image || '/api/placeholder/40/40',
      },
    });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isDeleted: false })
    .populate({
        path: 'comments',
        match: { isDeleted: false },
        populate: [
          { path: 'replies', match: { isDeleted: false } },
          { path: 'userId', select: 'name image' }, // جلب بيانات المستخدم للتعليقات
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithUser = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.userId).select('name image');
      return {
        ...post,
        userName: user.name,
        userAvatar: user.image || '/api/placeholder/40/40',
      };
    }));

    res.status(200).json({
      posts: postsWithUser,
      currentPage: page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false })
      .populate({
        path: 'comments',
        match: { isDeleted: false },
        populate: [
          { path: 'replies', match: { isDeleted: false } },
          { path: 'userId', select: 'name image' },
        ],
      })
      .lean();
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    const user = await User.findById(post.userId).select('name image');
    const comments = await Comment.find({ postId: post._id, isDeleted: false }).lean();
    const commentsWithUser = await Promise.all(comments.map(async (comment) => {
      const commentUser = await User.findById(comment.userId).select('name image');
      return {
        ...comment,
        userName: commentUser.name,
        userAvatar: commentUser.image || '/api/placeholder/40/40',
      };
    }));

    res.status(200).json({
      post: {
        ...post,
        userName: user.name,
        userAvatar: user.image || '',
      },
      comments: commentsWithUser,
    });
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { postId, content } = req.body;
    const user = await User.findById(req.user.id).select('name image');
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const post = await Post.findById(postId);
    if (!post || post.isDeleted) return res.status(404).json({ message: 'المنشور غير موجود' });

    console.log('Post before adding comment:', post); // Debug log

    const comment = new Comment({
      postId,
      userId: req.user.id,
      content,
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();
    console.log('Post after adding comment:', await Post.findById(postId)); // Debug log

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name image')
      .lean();

    res.status(201).json({
      message: 'تم إضافة التعليق بنجاح',
      comment: {
        ...populatedComment,
        userName: user.name,
        userAvatar: user.image || '/api/placeholder/40/40',
      },
    });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};



exports.addReply = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { commentId, content } = req.body;
    const user = await User.findById(req.user.id).select('name image');
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const parentComment = await Comment.findById(commentId);
    if (!parentComment || parentComment.isDeleted) return res.status(404).json({ message: 'التعليق غير موجود' });

    const reply = new Comment({
      postId: parentComment.postId,
      userId: req.user.id,
      content,
    });
    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    const populatedReply = await Comment.findById(reply._id)
      .populate('userId', 'name image')
      ;

    res.status(201).json({
      message: 'تم إضافة الرد بنجاح',
      reply: {
        ...populatedReply,
        userName: user.name,
        userAvatar: user.image || '/api/placeholder/40/40',
      },
    });
  } catch (error) {
    console.error('Error adding reply:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود أو غير مسموح لك بحذفه' });

    post.isDeleted = true;
    await post.save();

    res.status(200).json({ message: 'تم حذف المنشور بنجاح' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, userId: req.user.id });
    if (!comment) return res.status(404).json({ message: 'التعليق غير موجود أو غير مسموح لك بحذفه' });

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({ message: 'تم حذف التعليق بنجاح' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    post.isReported = true;
    await post.save();

    res.status(200).json({ message: 'تم الإبلاغ عن المنشور بنجاح' });
  } catch (error) {
    console.error('Error reporting post:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.reportComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'التعليق غير موجود' });

    comment.isReported = true;
    await comment.save();

    res.status(200).json({ message: 'تم الإبلاغ عن التعليق بنجاح' });
  } catch (error) {
    console.error('Error reporting comment:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'يجب إدخال كلمة بحث' });

    const posts = await Post.find({
      content: { $regex: query, $options: 'i' },
      isDeleted: false,
    }).sort({ createdAt: -1 }).lean();

    const postsWithUser = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.userId).select('name image');
      return {
        ...post,
        userName: user.name,
        userAvatar: user.image || '/api/placeholder/40/40',
      };
    }));

    res.status(200).json({ posts: postsWithUser });
  } catch (error) {
    console.error('Error searching posts:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};



exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.isDeleted) return res.status(404).json({ message: 'المنشور غير موجود' });

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.status(200).json({ message: 'تم الإعجاب بالمنشور', likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
};