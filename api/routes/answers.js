const router = require("express").Router();
const User = require("../models/User");
const Answer = require("../models/Answer");
const Post = require("../models/Post");


router.post('/accept', async (req, res) => {
	const { answer_id } = req.body;
	const answer = await Answer.findById(answer_id);

	const post = await Post.findById(answer.question_id);

	post.status = 1;
	post.answer_accept = {
		id: answer._id,
		content: answer.desc
	}

	await post.save();
	res.status(200).json(post);
})

//CREATE Answer
router.post("/", async (req, res) => {

	const answer = new Answer(req.body);
	try {
		const savedAnswer = await answer.save();
		res.status(200).json(savedAnswer);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

//UPDATE Answer
router.put("/:id", async (req, res) => {
	try {
		const answer = await Answer.findById(req.params.id);
		if (answer.username === req.body.username) {
			try {
				const updatedAnswer = await Answer.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedAnswer);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can update only your answer!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE POST
router.delete("/:id", async (req, res) => {
	try {
		const answer = await Answer.findById(req.params.id);
		if (answer.username === req.body.username) {
			try {
				await answer.delete();
				res.status(200).json("Answer has been deleted...");
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can delete only your answer!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});



//GET ALL Answer
router.get("/", async (req, res) => {

	const question_id = req.query.question_id;
	try {
		let answers;
		answers = await Answer.find({
			question_id: question_id
		});


		var user_names = comments.map(e => e.username);

		var users = await User.find({
			user_name: user_names
		});

		var users_array = {};
		for (var i = 0; i < users.length; i++) {
			users_array[users[i]._id] = users[i];
		}

		var answers_data = [];
		for (var i = 0; i < answers.length; i++) {
			var user_data = users_array[answers[i].user_id];


			if (!user_data) {
				continue;
			}

			if (!user_data.avatar) {
				user_data.avatar = `upload/no_avatar_0.jpg`;
			}

			var obj = {
				...answers[i]._doc,
				user_username: user_data.username,
				user_avatar: user_data.profilePic,
			};

			answers_data.push(obj);
		}

		return res.status(200).json(answers_data);
	} catch (err) {
		return res.status(500).json(err);
	}
});

module.exports = router;
