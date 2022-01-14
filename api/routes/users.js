const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");


router.post('/toggle.role', async (req, res) => {
	const {id} = req.body;
	const user = await User.findById(id);

	console.log('role', user);

	if (!user.role) {
		user.role = 1;
	} else {
		user.role = 0;
	}

	await user.save();

	res.status(200).json(user);

})

//UPDATE
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		} else {
			delete req.body.password
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(401).json("You can update only your account!");
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			try {
				await Post.deleteMany({ username: user.username });
				await User.findByIdAndDelete(req.params.id);
				res.status(200).json("User has been deleted...");
			} catch (err) {
				res.status(500).json(err);
			}
		} catch (err) {
			res.status(404).json("User not found!");
		}
	} else {
		res.status(401).json("You can delete only your account!");
	}
});

//GET USER
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});


//GET USERs
router.get("/", async (req, res) => {
	try {

		var { page, page_size, q } = req.query;
		if (!page) {
			page = 1;
		}

		page = Number(page);
		if (!page_size) {
			page_size = 10;
		}

		var params = {};
		if (q) {
			params = {
				$text: { $search: q }
			}
		}

		let users;
		users = await User.find(params)
		.skip((Math.max(0, page - 1)) * page_size)
		.limit(page_size).sort({createdAt: -1});

		var users_data = [];
		for (var i = 0; i < users.length; i++) {
		
			if (!users[i].profilePic) {
				users[i].profilePic = `no_avatar_0.jpg`;
			}

			var obj = {
				...users[i]._doc,
				user_username: users[i].username,
				user_avatar: users[i].profilePic,
			};

			users_data.push(obj);
		}

		res.status(200).json(users_data);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);

	}
});

module.exports = router;
