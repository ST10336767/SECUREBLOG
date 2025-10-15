const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    status: {
         type: String, 
         enum: ['draft','published'], 
         default: 'draft'},
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"},
    publishedDate: {
        type: Date
    }
});

module.exports = mongoose.model("Post", postSchema);