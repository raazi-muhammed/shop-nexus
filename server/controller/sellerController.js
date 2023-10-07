const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.post("/login-seller", async (req, res) => {
	let user = await User.findOne(
		{ email: req.body.email },
		{ password: 1, email: 1, fullName: 1, role: 1 } // used projection because other password is not returend
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

	console.log(user.role);

	const gwtTok = user.getJwtToken();
	console.log("gwtTok: " + gwtTok);

	res.status(200).json({
		success: isPasswordMatch,
		role: user.role,
	});
});

module.exports = router;
