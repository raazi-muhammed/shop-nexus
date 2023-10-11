const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const { isAdminAuthenticated } = require("../middleware/adminAuth");

router.post("/login", async (req, res) => {
	try {
		const { userName, password } = req.body;

		if (userName !== process.env.ADMIN_USERNAME) {
			res.status(403).json({
				success: false,
				message: "Username Incorrect",
			});
			return;
		}

		if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
			res.status(403).json({
				success: false,
				message: "Password Incorrect",
			});
			return;
		}
		const options = {
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		};
		res
			.status(200)
			.cookie("adminDetails", { userName, password }, options)
			.json({
				success: true,
				message: "You are an Admin",
			});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/get-all-users", isAdminAuthenticated, async (req, res) => {
	try {
		const userData = await User.find({});

		res.status(200).json({
			success: true,
			userDetails: userData,
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/block-user", isAdminAuthenticated, async (req, res) => {
	try {
		const { id, action } = req.body;
		const userData = await User.findOneAndUpdate(
			{ _id: id },
			{ isBlocked: action },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: action ? "Blocked user" : "Unblocked User",
			userDetails: userData,
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
