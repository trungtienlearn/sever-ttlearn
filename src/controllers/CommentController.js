const Comment = require('../models/Comment');

class CommentController {
    // Get all comments
    static async getAllComments(req, res) {
        try {
            const comments = await Comment.find();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single comment by ID
    static async getCommentById(req, res) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new comment
    static async createComment(req, res) {
        const comment = new Comment({
            text: req.body.text,
            author: req.body.author,
            postId: req.body.postId
        });

        try {
            const newComment = await comment.save();
            res.status(201).json(newComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a comment by ID
    static async updateComment(req, res) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            comment.text = req.body.text || comment.text;
            comment.author = req.body.author || comment.author;

            const updatedComment = await comment.save();
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a comment by ID
    static async deleteComment(req, res) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            await comment.remove();
            res.status(200).json({ message: 'Comment deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CommentController;