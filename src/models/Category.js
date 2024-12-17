const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
	},
	{
		timestamps: true,
	}
);

categorySchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model("Category", categorySchema);