const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
	{
		question_id: {
			type: String,
			required: true
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
