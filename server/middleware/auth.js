const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["userToken"];
	} catch (err) {
		res.status(500).json({ success: false, message: "No token found" });
		return next(new ErrorHandler("No token Found"));
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
