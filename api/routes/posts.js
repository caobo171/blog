const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Answer = require("../models/Answer");

//CREATE POST
router.post("/", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

//UPDATE POST
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				const updatedPost = await Post.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedPost);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can update only your post!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE POST
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				await post.delete();
				res.status(200).json("Post has been deleted...");
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can delete only your post!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		const answers = await Answer.find({
			question_id: post._id
		}).sort({createdAt: -1});


		var user_names = answers.map(e => e.username);
		user_names.push(post.username);

		var users = await User.find({
			username: user_names
		});

		var users_array = {};
		for (var i = 0; i < users.length; i++) {
			users_array[users[i].username] = users[i];
		}
		var user_data = users_array[post.username];

		var post_data = {
			...post._doc,
			user_username: user_data.username,
			user_avatar: user_data.profilePic
		};

		var answers_data = [];
		for (var i = 0; i < answers.length; i++) {
			var user_data = users_array[answers[i].username];

		   
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

		res.status(200).json({
			post: post_data, 
			answers: answers_data});
	} catch (err) {
		console.log(err)
		res.status(500).json(err);
	}
});

//GET ALL POSTS
router.get("/", async (req, res) => {
	var {page, page_size, q} = req.query;
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

	try {
		let posts;
		posts = await Post.find(params)
		.skip((Math.max(0, page - 1)) * page_size)
		.limit(page_size).sort({createdAt: -1});

		var user_names = posts.map(e => e.username);
		var users = await User.find({
			username: user_names
		});

		var users_array = {};
		for (var i = 0; i < users.length; i++) {
			users_array[users[i].username] = users[i];
		}

		var posts_data = [];
		for (var i = 0; i < posts.length; i++) {
			var user_data = users_array[posts[i].username];

		   
			if (!user_data) {
				continue;
			}

			if (!user_data.avatar) {
				user_data.avatar = `images/no_avatar_0.jpg`;
			}

			var obj = {
				...posts[i]._doc,
				user_username: user_data.username,
				user_avatar: user_data.profilePic,
			};

			posts_data.push(obj);
		}


		res.status(200).json(posts_data);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
