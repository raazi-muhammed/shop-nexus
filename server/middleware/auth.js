const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
	const token = req.cookies["token"];
	console.log(token);

	if (!token) {
		return next(new ErrorHandler("Please login to couintes"));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
	req.user = await User.findById(decoded.id);
	next();
});
