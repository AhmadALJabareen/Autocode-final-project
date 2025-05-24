const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check } = require('express-validator');
const postController = require('../controllers/postController');

router.get('/', postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPostById);
router.post(
  '/',
  [
    auth,
    check('content', 'محتوى المنشور مطلوب').not().isEmpty(),
  ],
  postController.createPost
);
router.post(
  '/comment',
  [
    auth,
    check('postId', 'معرف المنشور مطلوب').not().isEmpty(),
    check('content', 'محتوى التعليق مطلوب').not().isEmpty(),
  ],
  postController.addComment
);

router.post(
  '/reply',
  auth,
  [
    check('commentId', 'معرف التعليق مطلوب').not().isEmpty(),
    check('content', 'المحتوى مطلوب').not().isEmpty(),
  ],
  postController.addReply
);

router.delete('/:id', auth, postController.deletePost);
router.delete('/comment/:commentId', auth, postController.deleteComment);
router.post('/like/:id', auth, postController.likePost);
// router.post('/support/:postId/:commentId', auth, postController.supportComment);
router.post('/report/:id', auth, postController.reportPost);
router.post('/report/comment/:commentId', auth, postController.reportComment);

module.exports = router;