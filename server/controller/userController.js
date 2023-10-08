const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");

router.post("/create-user", async (req, res, next) => {
	try {
		const { fullName, email, password, age, profilePic } = req.body;

		const userEmail = await User.findOne({ email });

		if (userEmail) {
			console.log("user laready exists");
		}

		const user = {
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			profilePic: profilePic,
		};

		const createActivationToken = (user) => {
			return jwt.sign(user, process.env.ACTIVATION_SECRET, {
				expiresIn: "5m",
			});
		};
		const activationToken = createActivationToken(user);
		const activationUrl = `http://localhost:5173/api/v1/activation?activation_token=${activationToken}`;

		console.log(activationUrl);
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
	try {
		let user = await User.findOne(
			{ email: req.body.email },
			{ password: 1, email: 1, fullName: 1 } // used projection because otherwise password is not returned
		);

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not Found",
			});
			return;
		}

		isPasswordMatch = await user.comparePassword(req.body.password);
		if (!isPasswordMatch) {
			res.status(401).json({
				success: false,
				message: "Password Incorrect",
			});
			return;
		}
		sendToken(user, 201, res);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal Serer Error",
		});
	}
});

//Load user
router.get(
	"/load-user",
	isAuthenticated,
	catchAsyncError(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id);

			res.status(200).json({
				success: true,
				user,
			});
		} catch (error) {
			//console.log(error);
			res
				.status(500)
				.json({ success: false, message: "Error in Loading User" });
		}
	})
);

router.get("/get-current-user", (req, res) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader.split(" ")[1];
	console.log(token);

	if (token) {
		console.log("token is not null");
		jwt.verify(token, process.env.ACTIVATION_SECRET, (err, user) => {
			console.log(user);
		});
	}
	res.status(200).json({
		success: true,
		currentUserPage: true,
		user: token,
	});
});

module.exports = router;
