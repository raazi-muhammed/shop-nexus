const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Shop = require("../model/Shop");

exports.isSellerAuthenticated = asyncErrorHandler(async (req, res, next) => {
	let token;
	try {
		token = req.cookies["sellerToken"];
	} catch (err) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return next("no token");
	}

	if (!token) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return;
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const sellerFound = await Shop.findById(decoded.id);
	if (!sellerFound)
		res.status(500).json({ success: false, message: "No User found" });
	req.seller = sellerFound;

	next();
});
