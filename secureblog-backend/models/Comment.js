const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: String,
    author: String,
    text: String,
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending"
    }
});


module.exports = mongoose.model("Comment", commentSchema);