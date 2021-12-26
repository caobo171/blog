const router = require("express").Router();
const User = require("../models/User");
const Answer = require("../models/Answer");

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

		return res.status(200).json(answers);
	} catch (err) {
		return res.status(500).json(err);
	}
});

module.exports = router;
