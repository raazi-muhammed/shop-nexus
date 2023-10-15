const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["userToken"];
	} catch (err) {
		res.status(500).json({ success: false, message: "No token found" });
		return;
	}

	if (!token) {
		res.status(500).json({ success: false, message: "No value of Token" });
		return;
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const userFound = await User.findById(decoded.id);
	if (!userFound)
		res.status(500).json({ success: false, message: "No User found" });
	req.user = userFound;
	next();
});
