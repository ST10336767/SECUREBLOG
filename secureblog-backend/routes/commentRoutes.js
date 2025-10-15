const express = require("express");
const router = express.Router();
const {protect, requireRole} = require("../middleware/authMiddleware");
const {submitComment, viewComments, approveComment} = require("../controllers/commentController");


router.get("/", viewComments);
router.post("/:postId/submit-comment", protect, submitComment);
router.post("/:commentId/approve-comment", protect, requireRole("admin", "editor"),approveComment);

module.exports = router;