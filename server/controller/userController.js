const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

//router.post("/create-user", upload.single("file"), async (req, res, next) => {
router.post("/create-user", async (req, res, next) => {
	try {
		const { fullName, email, password, age, profilePic } = req.body;

		const userEmail = await User.findOne({ email });

		if (userEmail) {
			return next(new ErrorHandler("User already exists", 400));
		}

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
		const activationUrl = `http://localhost:5173/api/v1/activation?activation_token=${activationToken}`;
		//const newUser = await User.create(user);
		console.log(activationUrl);
		/* res.status(201).json({
			success: true,
			//newUser,
		}); */
		await sendMail({
			email: user.email,
			subject: "Activate you account",
			message: `Click to activate ${activationUrl}`,
		});
		res.status(201).json({
			success: true,
			message: `please check your email`,
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/activation", async (req, res) => {
	try {
		const { activation_token } = req.body;
		console.log(activation_token);
		const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
		if (!newUser) return next("Invalid Token");

		const { fullName, email, password, age, profilePic } = newUser;

		const dataUser = await User.create({
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			profilePic: profilePic,
		});

		res.status(201).json({
			success: 200,
		});
		sendToken(dataUser, 201, res);
	} catch (error) {
		console.log(error);
	}
});

router.post("/login-user", async (req, res) => {
	req.session.user = {
		username: "raazi",
		age: 18,
	};

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

router.get("/get-current-user", (req, res) => {
	//console.log(res.session);
	res.status(200).json({
		success: true,
		currentUserPage: true,
		user: req.session.user,
	});
});

module.exports = router;
