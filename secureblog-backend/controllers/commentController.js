const Comment = require("../models/Comment");
const permissions = require("../src/utils/permissions");




//readers
exports.submitComment = async (req,res) => {
    try{
        const comment =  await Comment.create({
            postId: req.params.postId,
            author: req.user.id,
            text: req.body.text,
            status: "pending"
            })
        
           res.status(201).json(comment);

    } catch (err){
         console.error('Error creating comment:', err);
         res.status(500).json({ message: "Error creating comment"});
    }
}

//Editors & admins only
exports.approveComment = async (req,res) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if (!comment ) return res.status(404).json({ message: "Comment not found"});

        if( !permissions.canApproveComment(req.user))
            return res.status(403).json({ message: "Only admins and editors can approve a comment"})

        comment.status = "approved";
        comment.save();
        res.json(comment);

    } catch (err){
        console.log("Erorr:" + err)
        res.status(500).json({ message: "Server Erorr"})
        
    }
}




//Everybody
exports.viewComments = async (req,res) => {
    try{
        const comments = await Comment.find({ status : "approved"});
        res.json(comments)

    } catch (err){
        console.log(err)
        res.status(500).json({ message: "Server error"});
    }
}