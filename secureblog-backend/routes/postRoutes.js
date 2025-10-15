const express = require("express");
const router = express.Router();
const {protect, requireRole, requireSelfOrRole } = require("../middleware/authMiddleware");
const {getPosts, updatePost, createDraft, publishPost, deletePost} = require("../controllers/postController");

//create
router.post("/create", protect, requireRole("author"), createDraft);

//author can updaite own, editrs/admins can edit ksjdksjmd
router.put("/:id", protect, requireSelfOrRole("editor","admin"), updatePost);

router.get("/", getPosts);

// router.post(:/id/po)
router.post("/:id/publish", protect, publishPost);

router.delete("/:id", protect, deletePost);



module.exports = router;