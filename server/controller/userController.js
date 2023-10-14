const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { upload } = require("../multer");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");

router.post("/create-user", async (req, res, next) => {
	try {
		const { fullName, email, password, age } = req.body;

		const userEmail = await User.findOne({ email });
		if (userEmail) {
			res.status(400).json({
				success: false,
				errorWith: "email",
				message: "User already exists with this email",
			});
			return;
		}

		const user = {
			fullName: fullName,
			email: email,
			age: age,
			password: password,
		};

		const createActivationToken = (user) => {
			return jwt.sign(user, process.env.ACTIVATION_SECRET, {
				expiresIn: "5m",
			});
		};

		const activationToken = createActivationToken(user);
		const activationUrl = `http://localhost:5173/api/v1/activation?activation_token=${activationToken}`;

		await sendMail({
			email: user.email,
			subject: "Activate you account",
			message: `Click to activate ${activationUrl}`,
		});

		/* Can be removed, added so that don't have to check mail while testing */
		console.log(activationUrl);

		res.status(201).json({
			success: true,
			message: `Please check your email`,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.post("/activation", async (req, res) => {
	try {
		const { activation_token } = req.body;
		const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
		if (!newUser) return next("Invalid Token");

		const { fullName, email, password, age, profilePic } = newUser;

		const userExits = await User.findOne({ email });
		if (userExits) return;

		const dataUser = await User.create({
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			profilePic: profilePic,
		});

		sendToken(dataUser, 201, res);
	} catch (error) {
		res.status(500).json({
			success: false,
		});
		console.log(error);
	}
});

router.post("/login-user", async (req, res) => {
	try {
		let user = await User.findOne(
			{ email: req.body.email },
			{ password: 1, email: 1, fullName: 1, isBlocked: 1 } // used projection because otherwise password is not returned
		);

		if (!user) {
			res.status(404).json({
				success: false,
				errorWith: "user",
				message: "User not Found",
			});
			return;
		}

		isPasswordMatch = await user.comparePassword(req.body.password);
		if (!isPasswordMatch) {
			res.status(401).json({
				success: false,
				errorWith: "password",
				message: "Password Incorrect",
			});
			return;
		}

		if (user.isBlocked) {
			res.status(401).json({
				success: false,
				errorWith: "user",
				message: "You are Blocked",
			});
			return;
		}
		sendToken(user, 201, res, "userToken");
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal Serer Error",
		});
	}
});

router.get("/logout", (req, res) => {
	try {
		res.status(200).clearCookie("userToken").json({
			success: true,
			message: "User is Logged out",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/user-details", isAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Error in getting User" });
	}
});

router.put(
	"/edit-user-details",
	isAuthenticated,
	upload.single("file"),
	async (req, res) => {
		try {
			const { email, fullName } = req.body;
			let user;

			user = await User.findOneAndUpdate(
				{ _id: req.user.id },
				{ fullName, email },
				{ new: true }
			);

			if (req.file) {
				const fileUrl = `http://localhost:3000/images/${req.file.filename}`;
				user = await User.findOneAndUpdate(
					{ _id: req.user.id },
					{ $set: { "avatar.url": fileUrl } },
					{ new: true }
				);
			}

			res.status(200).json({
				success: true,
				message: "User Updated",
				user,
			});
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Error in getting User" });
		}
	}
);

router.post("/add-address", isAuthenticated, async (req, res) => {
	try {
		const {
			fullName,
			phoneNumber,
			pinCode,
			state,
			city,
			addressLine1,
			addressLine2,
			addressType,
		} = req.body;

		const user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			{
				$addToSet: {
					addresses: {
						fullName,
						phoneNumber,
						pinCode,
						state,
						city,
						address1: addressLine1,
						address2: addressLine2,
						addressType,
					},
				},
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "User Updated",
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: "Error Adding Address" });
	}
});

router.post("/remove-address", isAuthenticated, async (req, res) => {
	try {
		const { addressId } = req.body;
		const user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			{ $pull: { addresses: { _id: addressId } } },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Address Removed",
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: "Error Adding Address" });
	}
});

//Load user
router.get(
	"/load-user",
	isAuthenticated,
	catchAsyncError(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id);

			if (user.isBlocked) {
				res.status(200).json({
					success: false,
					message: "You are Blocked",
				});
				return;
			}

			res.status(200).json({
				success: true,
				user,
			});
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Error in Loading User" });
		}
	})
);

module.exports = router;
