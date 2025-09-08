const express = require('express');
// The { mergeParams: true } option is crucial here to access params from the parent router (e.g., postId)
const router = express.Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment.model');
const { protect } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

// @route   POST /api/posts/:postId/comments
// @desc    Submit a new comment for a specific post
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { content } = req.body;
    const authorId = req.user.id;
    const postId = req.params.postId;

    const newComment = new Comment({
        post: postId,
        author: authorId,
        content,
        status: 'pending',
    });

    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
}));

// @route   PUT /api/posts/:postId/comments/approve/:id
// @desc    Approve a comment (Editors or Admins only)
// @access  Private
router.put('/approve/:id', protect, requireRoles(['editor', 'admin']), asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found.');
    }

    comment.status = 'approved';
    const approvedComment = await comment.save();
    res.json(approvedComment);
}));

// @route   GET /api/posts/:postId/comments
// @desc    List all approved comments for a specific post (Everyone)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.find({
        post: req.params.postId,
        status: 'approved',
    }).populate('author', 'email role');

    res.json(comments);
}));

module.exports = router;