const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
	try {

		let exist_user = await User.findOne({ email: req.body.email });
		if (exist_user) {
			return res.status(200).json({
				message: 'User email is existed'
			});
		}

		exist_user = await User.findOne({ username: req.body.username });
		if (exist_user) {
			return res.status(200).json({
				message: 'Username is existed'
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPass,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		let user = await User.findOne({ username: req.body.username });

		console.log('user', user);

		if (!user) {
			user = await User.findOne({ email: req.body.username });
		}

		if (!user) {
			return res.status(400).json("Wrong credentials!");
		} 

		const validated = await bcrypt.compare(req.body.password, user.password);
		if (!validated) {
			return res.status(400).json("Wrong credentials!");
		}

		const { password, ...others } = user._doc;
		return res.status(200).json(others);
	} catch (err) {
		console.log('err', err);
		res.status(500).json(err);
	}
});

module.exports = router;
