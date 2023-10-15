const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const adminLogIn = asyncErrorHandler(async (req, res, next) => {
	const { userName, password } = req.body;

	if (userName !== process.env.ADMIN_USERNAME)
		return next(new ErrorHandler("Invalid Username", 403));

	if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD)))
		return next(new ErrorHandler("Invalid Password", 401));

	const options = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(200).cookie("adminDetails", { userName, password }, options).json({
		success: true,
		message: "You are an Admin",
	});
});

const adminLogOut = asyncErrorHandler(async (req, res, next) => {
	res.status(200).clearCookie("adminDetails").json({
		success: true,
		message: "User is Logged out",
	});
});

const getAllUsers = asyncErrorHandler(async (req, res, next) => {
	const userData = await User.find({});
	res.status(200).json({
		success: true,
		userDetails: userData,
	});
});

const adminBlockAndUnBlockUser = asyncErrorHandler(async (req, res) => {
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
});

module.exports = {
	adminLogOut,
	adminLogIn,
	getAllUsers,
	adminBlockAndUnBlockUser,
};
