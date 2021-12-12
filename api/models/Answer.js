const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		desc: {
			type: String,
			required: true,
		},
		photo: {
			type: String,
			required: false,
		},
		username: {
			type: String,
			required: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Answer", AnswerSchema);
