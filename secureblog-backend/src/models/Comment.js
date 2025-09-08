const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    // The ID of the post this comment belongs to, referencing the Post model
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    // The user who wrote the comment, referencing the User model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The text content of the comment
    content: {
        type: String,
        required: true,
        trim: true,
    },
    // The moderation status of the comment (pending or approved)
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending',
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Comment', CommentSchema);
