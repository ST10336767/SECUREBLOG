//ddded for rbac and postys

const Post = require("../models/Post");
const permissions = require("../src/utils/permissions");


//draftttt
exports.createDraft = async (req, res) => {
    try{

         if (req.user.role !== "author") {
      return res.status(403).json({ message: "Only authors can create posts" });
        }
        console.log(req.user)
        console.log(req.user.id)

        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            status: "draft",
            author: req.user.id,
        });
        res.status(201).json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Error creating post"});
    }
};

//published posts
exports.getPosts = async (req, res) => {
    try{
        const posts = await Post.find({ status: "published"});
        res.json(posts);
    } catch(err) {
        res.status(500).json({message: "Error fetching posts"});
    }
};


exports.getSinglePost = async (req,res) => {
    try{
        // const post = await Post.findById(req.params.id);

        const post  = await Post.findOne({
            _id: req.params.id,
             status: "published",
            });
        
            if (!post)
                return res.status(404).json({ message: "Post not found."});

              // If not published, only author or admin can view
        if (post.status !== "published") {
        if (!req.user || (req.user.id !== post.author.toString() && req.user.role !== "admin")) {
            return res.status(403).json({ message: "Not authorized to view this post" });
        }
        }
        res.json(post);
    } catch(err){
        console.log("Error:"+err)
        res.status(500).json( { message: "Not found"});
    }
};


exports.updatePost = async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found"});
    

    // //Owner check
    // if (post.user.toString() !== req.user.id && req.user.role !== "admin"){
    //     return res.status(403).json({message: "Forbidden"});
    // }
    // maybe betterer i guess
    if (!permissions.canEditPost(req.user, post)){
         return res.status(403).json({message: "Forbidden"});
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
} catch (err){
    res.status(500).json({ message: "Error updating post"});
}

};



exports.publishPost = async (req,res,) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found"});

        if (!permissions.canPublish(req.user)) 
            return res.status(403).json({message: "Forbidden: Only admins and editors can publish"})

        post.status = "published",
        post.publishedDated =  new Date();
        await post.save();

        res.json(post);

    } catch (err) {
         console.log("Error:"+err)
         res.status(500).json({ message: "Error publishing post" });
  }
};


  exports.deletePost = async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post Not found"});

        if( !permissions.canHardDelete(req.user))
            return res.status(403).json({ message: "Forbidden: Only admins can delete"});

        await post.deleteOne();
        res.json({ message: "Post has been deleted."})

    } catch(err){
         console.log("Error:"+err)
         res.status(500).json({ message: "Error publishing post" });
    }
  };

