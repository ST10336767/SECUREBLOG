const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment.model'); // The Comment model
const { protect } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

// @route   POST /api/comments
// @desc    Submit a new comment (Readers and up can submit)
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { postId, content } = req.body;
    const authorId = req.user.id; // Get the user's ID from the JWT payload

    // Create a new comment with a 'pending' status by default
    const newComment = new Comment({
        post: postId,
        author: authorId,
        content,
        status: 'pending',
    });

    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
}));

// @route   PUT /api/comments/approve/:id
// @desc    Approve a comment (Editors or Admins only)
// @access  Private
router.put('/approve/:id', protect, requireRoles(['editor', 'admin']), asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found.');
    }

    // Update the comment status to 'approved'
    comment.status = 'approved';
    const approvedComment = await comment.save();
    res.json(approvedComment);
}));

// @route   GET /api/comments/:postId
// @desc    List all approved comments for a specific post (Everyone)
// @access  Public
router.get('/:postId', asyncHandler(async (req, res) => {
    const comments = await Comment.find({
        post: req.params.postId,
        status: 'approved',
    }).populate('author', 'email role'); // Populate the author details

    res.json(comments);
}));

module.exports = router;