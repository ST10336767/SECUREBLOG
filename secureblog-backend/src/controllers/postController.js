const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post.model'); // Assuming a Post model
const { protect } = require('../middleware/auth.middleware');
const { requireRole, requireRoles } = require('../middleware/roles.middleware');

// @route   POST /api/posts/drafts
// @desc    Create a new post draft (Authors only)
// @access  Private
router.post('/drafts', protect, requireRole('author'), asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user.id; // Get the user's ID from the JWT payload

    const newPost = new Post({
        title,
        content,
        author: authorId,
        status: 'draft',
    });

    const createdPost = await newPost.save();
    res.status(201).json(createdPost);
}));

// @route   PUT /api/posts/drafts/:id
// @desc    Edit a draft post (Only by the author)
// @access  Private
router.put('/drafts/:id', protect, asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    // Check if the post exists
    if (!post) {
        res.status(404);
        throw new Error('Post not found.');
    }

    // Check if the user is the author and if the post is a draft
    if (post.author.toString() !== req.user.id || post.status !== 'draft') {
        res.status(403);
        throw new Error('Not authorized to edit this draft.');
    }

    // Update the post with new data
    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
}));

// @route   PUT /api/posts/publish/:id
// @desc    Publish a post (Editors or Admins only)
// @access  Private
router.put('/publish/:id', protect, requireRoles(['editor', 'admin']), asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found.');
    }

    // Update the post status to 'published'
    post.status = 'published';
    const publishedPost = await post.save();
    res.json(publishedPost);
}));

// @route   DELETE /api/posts/:id
// @desc    Delete a post (Admins only)
// @access  Private
router.delete('/:id', protect, requireRole('admin'), asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found.');
    }

    await post.remove();
    res.json({ message: 'Post removed successfully.' });
}));

// @route   GET /api/posts
// @desc    List all published posts (All roles)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const posts = await Post.find({ status: 'published' }).populate('author', 'email role'); // Populate author details
    res.json(posts);
}));

// @route   GET /api/posts/:id
// @desc    View a single published post (All roles)
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id, status: 'published' }).populate('author', 'email role');

    if (!post) {
        res.status(404);
        throw new Error('Published post not found.');
    }

    res.json(post);
}));

module.exports = router;