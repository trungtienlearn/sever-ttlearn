const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongoose_delete = require('mongoose-delete');

const postSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		imageThumbnail: { type: String },
		content: { type: String, required: true },
		isPublic: { type: Boolean, default: true },
		slug: { type: String, slug: "title", unique: true },
		updatedAt: { type: Date, default: Date.now },
		category: { type: String, required: true },
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
		views: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

mongoose.plugin(slug);
postSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });

module.exports = mongoose.model("Post", postSchema);
