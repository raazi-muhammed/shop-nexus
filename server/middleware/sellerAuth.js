const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isSellerAuthenticated = catchAsyncError(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["sellerToken"];
	} catch (err) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return next(new ErrorHandler("No token Found"));
	}

	if (!token) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return;
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
	next();
});
