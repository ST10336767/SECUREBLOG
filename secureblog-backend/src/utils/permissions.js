// src/utils/permissions.js
exports.canEditPost = (user, post) => {
  if (post.status === "draft") {
    return post.author.toString() === user.id; // only the author edits drafts
  }
  // published → only editors/admins can edit
  return ["editor", "admin"].includes(user.role);
};

exports.canPublish = (user) => ["editor", "admin"].includes(user.role);

exports.canHardDelete = (user) => user.role === "admin";

exports.canApproveComment = (user) => ["editor", "admin"].includes(user.role);