const Post = require("../models/Post");
const Likes = require("../models/Likes");

class PostController {
	show(req, res, next) {
		Post.find()
			.then((posts) => {
				res.send(posts);
			})
			.catch(next);
	}

	showPost(req, res, next) {
		Post.findOne({ slug: req.params.slug })
			.then((post) => res.status(200).json(post))
			.catch(next);
	}

	showPostById(req, res, next) {
		const id = req.params.id;
		Post.findOne({ _id: id })
			.then((post) => {
				res.json(post);
			})
			.catch(next);
	}

	detail(req, res, next) {
		Post.findById(req.params.id)
			.then((post) => {
				res.status(201).json(post);
			})
			.catch(next);
	}

	create(req, res, next) {
		const { title, content, isPublic } = req.body;

		const post = new Post({
			title,
			content,
			isPublic,
		});
		post.save()
			.then((newPost) => {
				res.status(201).json(newPost);
			})
			.catch(next);
	}

	updatePost(req, res, next) {
		const id = req.params.id;
		const { title, content, isPublic } = req.body;

		Post.updateOne({ _id: id }, { title, content, isPublic })
			.then((newPost) => {
				res.status(200).json(newPost);
			})
			.catch(next);
	}

	delete(req, res, next) {
		const id = req.params.id;
		Post.delete({ _id: id })
			.then(() => {
				Post.findOneAndUpdate(
					{ _id: id },
					{ deleted: false, deletedAt: null }
				)
					.then(() => {
						res.json({ message: "success" });
					})
					.catch((err) => res.json({ message: err }));
			})
			.catch(next);
	}

	restorePost(req, res, next) {
		const id = req.params.id;
		Post.restore({ _id: id })
			.then(() => {
				Post.findOneAndUpdate(
					{ _id: id },
					{ deleted: false, deletedAt: null }
				)
					.then(() => res.json({ message: "success" }))
					.catch((err) => res.json({ message: err }));
			})
			.catch(next);
	}

	destroyPost(req, res, next) {
		const id = req.params.id;
		Post.deleteOne({ _id: id })
			.then(() => res.json({ message: "success" }))
			.catch(next);
	}

	trashPosts(req, res, next) {
		Post.findDeleted()
			.then((deletedPosts) => res.send(deletedPosts))
			.catch(next);
	}

	countDeletedPost(req, res, next) {
		Post.countDocumentsDeleted()
			.then((count) => res.json(count))
			.catch(next);
	}

	likePost(req, res, next) {
		const postId = req.params.id;
		const userId = req.user.id; // Assuming you have user information in req.user

		const like = new Likes({ postId, userId });
		like.save()
			.then(() => res.json({ message: "success" }))
			.catch(next);
	}

	unlikePost(req, res, next) {
		const postId = req.params.id;
		const userId = req.user.id; // Assuming you have user information in req.user

		Likes.findOneAndDelete({ postId, userId })
			.then(() => res.json({ message: "success" }))
			.catch(next);
	}

	countLikes(req, res, next) {
		const postId = req.params.id;
		Likes.countDocuments({ postId })
			.then((count) => {
				res.json(count);
			})
			.catch(next);
	}
	
	// Kiểm tra xem bài viết đã được like chưa
	isLiked(req, res, next) {
		const postId = req.params.id;
		const userId = req.user.id; // Assuming you have user information in req.user

		Likes.findOne({ postId, userId })
			.then((like) => {
				if (like) {
					res.json({ isLiked: true });
				} else {
					res.json({ isLiked: false });
				}
			})
			.catch(next);
		}
	// Lấy số lượng người xem bài viết
	getViews(req, res, next) {
		const postId = req.params.id;
		Post.findOne({ _id: postId })
			.then((post) => {
				res.json(post.views);
			})
			.catch(next);
	}
	// Tăng số lượng người xem bài viết
	setView(req, res, next) {
		const postId = req.params.id;
		Post.findOneAndUpdate({ _id: postId }, { $inc: { views: 1 } })
			.then(() => res.json({ message: "success" }))
			.catch(next);
	}

}

module.exports = new PostController();
