const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorHandler = require("../utils/errorHandler");
const Shop = require("../model/Shop");
const bcrypt = require("bcrypt");

exports.isUserAuthenticated = asyncErrorHandler(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["userToken"];
	} catch (err) {
		return next(new ErrorHandler("Not Logged In", 500));
	}

	if (!token) {
		return next(new ErrorHandler("Not Authenticated", 500));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const userFound = await User.findById(decoded.id);
	if (!userFound)
		res.status(500).json({ success: false, message: "No User found" });
	req.user = userFound;
	next();
});

exports.isSellerAuthenticated = asyncErrorHandler(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["sellerToken"];
	} catch (err) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return next("No token");
	}
	if (!token) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return;
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const shopFound = await Shop.findById(decoded.id);
	if (!shopFound)
		res.status(500).json({ success: false, message: "No User found" });
	req.shop = shopFound;
	next();
});

exports.isAdminAuthenticated = asyncErrorHandler(async (req, res, next) => {
	const { userName, password } = req.cookies["adminDetails"];

	if (userName !== process.env.ADMIN_USERNAME) {
		return next(new ErrorHandler("Authentication Failed", 403));
	}

	if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
		return next(new ErrorHandler("Authentication Failed", 403));
	}
	next();
});
