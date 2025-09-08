import mongoose from 'mongoose';

// Define the Post Schema
// This schema defines the structure of the Post documents in the MongoDB collection.
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5 // Minimum length for post title
  },
  body: {
    type: String,
    required: true,
    minlength: 10 // Minimum length for post content
  },
  status: {
    type: String,
    enum: ['draft', 'published'], // Only allow these two values
    default: 'draft' // Default status is 'draft'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model's _id
    ref: 'User', // Specifies that this field refers to the 'User' model
    required: true
  },
},
{ timestamps: true});

// Create the Post model from the schema
// Mongoose will automatically create a collection named 'posts' (lowercase, plural)
// based on the 'Post' model name.
const Post = mongoose.model('Post', postSchema);

export default Post;
