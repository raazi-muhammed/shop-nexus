const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { upload } = require("../multer");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const bcrypt = require("bcrypt");

const userLogin = asyncErrorHandler(async (req, res, next) => {
	let user = await User.findOne({ email: req.body.email });
	sendToken(user, 201, res, "userToken");
});

const userAuthentication = asyncErrorHandler(async (req, res, next) => {
	let user = await User.findOne(
		{ email: req.body.email },
		{ password: 1, email: 1, fullName: 1, isBlocked: 1 } // used projection because otherwise password is not returned
	);

	if (!user) {
		res.status(404).json({
			success: false,
			errorWith: "user",
			message: "User not Found",
		});
		return;
	}

	if (user.isBlocked) {
		res.status(401).json({
			success: false,
			errorWith: "user",
			message: "You are Blocked",
		});
		return;
	}

	res.status(200).json({
		success: true,
		message: "Valid User",
	});
});

const loadUser = asyncErrorHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	if (user.isBlocked) {
		return next(new ErrorHandler("You are Blocked", 200));
	}

	res.status(200).json({
		success: true,
		user,
	});
});

const googleSignIn = asyncErrorHandler(async (req, res, next) => {
	//console.log(req.body);
	const { email, displayName, photoURL } = req.body.user;

	let user;
	user = await User.findOne({ email: email });

	if (!user) {
		user = await User.create({
			fullName: displayName,
			email: email,
			password: "password",
			"avatar.url": photoURL,
		});
	}
	if (user.isBlocked) {
		return next(new ErrorHandler("You are Blocked", 200));
	}

	console.log(user);
	sendToken(user, 201, res, "userToken");
});

const createUser = asyncErrorHandler(async (req, res, next) => {
	const { fullName, email, password, age } = req.body;

	const userEmail = await User.findOne({ email });
	if (userEmail) {
		res.status(400).json({
			success: false,
			errorWith: "email",
			message: "User already exists with this email",
		});
		return;
	}

	const user = {
		fullName: fullName,
		email: email,
		age: age,
		password: password,
	};

	const createActivationToken = (user) => {
		return jwt.sign(user, process.env.ACTIVATION_SECRET, {
			expiresIn: "5m",
		});
	};

	const activationToken = createActivationToken(user);
	const activationUrl = `http://localhost:5173/api/v1/activation?activation_token=${activationToken}`;

	await sendMail({
		email: user.email,
		subject: "Activate you account",
		message: `Click to activate ${activationUrl}`,
	});

	/* Can be removed, added so that don't have to check mail while testing */
	console.log(activationUrl);

	res.status(201).json({
		success: true,
		message: `Please check your email`,
	});
});

const activateUser = asyncErrorHandler(async (req, res, next) => {
	const { activation_token } = req.body;
	const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
	if (!newUser) return next("Invalid Token");

	const { fullName, email, password, age, profilePic } = newUser;

	const userExits = await User.findOne({ email });
	if (userExits) return;

	const dataUser = await User.create({
		fullName: fullName,
		email: email,
		age: age,
		password: password,
		"avatar.url": profilePic,
	});

	sendToken(dataUser, 201, res);
});

const userLogOut = asyncErrorHandler(async (req, res, next) => {
	res.status(200).clearCookie("userToken").json({
		success: true,
		message: "User is Logged out",
	});
});

const getUserDetails = asyncErrorHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

const editUserDetails = asyncErrorHandler(async (req, res, next) => {
	const { email, fullName } = req.body;
	let user;

	user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ fullName, email },
		{ new: true }
	);

	if (req.file) {
		const fileUrl = `http://localhost:3000/images/${req.file.filename}`;
		user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			{ $set: { "avatar.url": fileUrl } },
			{ new: true }
		);
	}

	res.status(200).json({
		success: true,
		message: "User Updated",
		user,
	});
});

const addAddress = asyncErrorHandler(async (req, res, next) => {
	const {
		fullName,
		phoneNumber,
		pinCode,
		state,
		city,
		addressLine1,
		addressLine2,
		addressType,
	} = req.body;

	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			$addToSet: {
				addresses: {
					fullName,
					phoneNumber,
					pinCode,
					state,
					city,
					address1: addressLine1,
					address2: addressLine2,
					addressType,
				},
			},
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "User Updated",
		user,
	});
});

const removeAddress = asyncErrorHandler(async (req, res, next) => {
	const { addressId } = req.body;
	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ $pull: { addresses: { _id: addressId } } },
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Address Removed",
		user,
	});
});

const changePassword = asyncErrorHandler(async (req, res, next) => {
	const { userId, currentPassword, newPassword } = req.body;

	let user = await User.findOne(
		{ _id: userId },
		{ password: 1 } // used projection because otherwise password is not returned
	);

	isPasswordMatch = await user.comparePassword(currentPassword);
	if (!isPasswordMatch) {
		res.status(401).json({
			success: false,
			errorWith: "password",
			message: "Password Incorrect",
		});
		return;
	}

	let newUser = await User.findOneAndUpdate(
		{ _id: userId },
		{ password: await bcrypt.hash(newPassword, 10) }
	);

	res.status(200).json({
		success: true,
		message: "Password Changed",
	});
});

module.exports = {
	userLogin,
	loadUser,
	createUser,
	activateUser,
	userLogOut,
	getUserDetails,
	editUserDetails,
	addAddress,
	removeAddress,
	changePassword,
	userAuthentication,
	googleSignIn,
};
