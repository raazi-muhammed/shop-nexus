const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../multer");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

//router.post("/create-user", upload.single("file"), async (req, res, next) => {
router.post("/create-user", async (req, res, next) => {
	try {
		const { fullName, email, password, age, profilePic } = req.body;
		//console.log(req.body);
		const userEmail = await User.findOne({ email });

		if (userEmail) {
			return next(new ErrorHandler("User already exists", 400));
		}
		//const filename = req.file.filename;
		//const fileUrl = path.join(filename);

		const user = {
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			profilePic: profilePic,
		};
		//console.log(user);

		const createActivationToken = (user) => {
			return jwt.sign(user, process.env.ACTIVATION_SECRET, {
				expiresIn: "5m",
			});
		};
		const activationToken = createActivationToken(user);
		const activationUrl = `http://localhost:3000/activation/${activationToken}`;
		const newUser = await User.create(user);
		res.status(201).json({
			success: true,
			newUser,
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/login-user", async (req, res) => {
	req.session.user = req.body;

	let user = await User.findOne(
		{ email: req.body.email },
		{ password: 1, email: 1, fullName: 1 } // used projection because other password is not returend
	);

	console.log(req.body.password);
	console.log(user);

	let isPasswordMatch;
	try {
		isPasswordMatch = await user.comparePassword(req.body.password);
		console.log(isPasswordMatch);
	} catch (error) {
		isPasswordMatch = false;
		console.log(error);
	}

	res.status(200).json({
		success: isPasswordMatch,
	});
});

module.exports = router;
