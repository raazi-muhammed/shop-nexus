const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["userToken"];
	} catch (err) {
		return next(new ErrorHandler("Not Authenticated", 500));
	}

	if (!token) {
		return next(new ErrorHandler("Not Logged In", 500));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const userFound = await User.findById(decoded.id);
	if (!userFound)
		res.status(500).json({ success: false, message: "No User found" });
	req.user = userFound;
	next();
});
