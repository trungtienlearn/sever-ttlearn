const express = require("express");
const router = express.Router();

// Middleware:
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Controller:
const PostController = require("../controllers/PostController");

router.get("/posts", PostController.show);
router.get("/post/getview/:id", PostController.getViews);
router.get("/post/setview/:id", PostController.setView);
router.get("/post/:id", PostController.showPostById);
router.get("/post/:slug", PostController.showPost);
router.get("/post/:id/is-liked", authenticateToken, authorizeRole(["admin", "editor", "user"]), PostController.isLiked);
router.get("/post/:id/like", authenticateToken, authorizeRole(["admin", "editor", "user"]), PostController.likePost);
router.get("/post/:id/unlike", authenticateToken, authorizeRole(["admin", "editor", "user"]), PostController.unlikePost);
router.get("/post/:id/likes", PostController.countLikes);
router.get("/count-deleted-post", PostController.countDeletedPost);
router.get("/trash-posts", PostController.trashPosts);
router.post("/post", PostController.create);
router.put("/post/:id", PostController.updatePost);
router.delete("/post/:id/destroy", PostController.destroyPost);
router.delete("/post/:id", PostController.delete);
router.patch("/restore-post/:id", PostController.restorePost);

module.exports = router;
