const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { sendMailHTML } = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { upload } = require("../multer");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const { createWalletForUser } = require("./transactionController");
const Transaction = require("../model/Transaction");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");
const generateRandomId = require("../utils/generateRandomId");
const { userCreatedViaReferral } = require("./referralController");
const {
	activateAccountMail,
} = require("../utils/emailTemplates/getHtmlTemplate");

// @METHOD POST
// @PATH /user/login-user
const userLogin = asyncErrorHandler(async (req, res, next) => {
	let user = await User.findOne({ email: req.body.email });
	sendToken(user, 201, res, "userToken");
});

// @METHOD POST
// @PATH /user/auth-user
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

// @METHOD GEt
// @PATH /user/load-user
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

// @METHOD POST
// @PATH /user/provider-sign-in
const providerSignIn = asyncErrorHandler(async (req, res, next) => {
	const { email, fullName, avatarUrl, referralCode } = req.body;

	let user;
	user = await User.findOne({ email: email });

	if (!user) {
		if (referralCode) {
			user = await User.create({
				fullName,
				email,
				password: "password",
				"avatar.url": avatarUrl,
				referral: {
					viaReferral: true,
					viaReferralDetails: {
						code: referralCode,
					},
				},
			});
			await userCreatedViaReferral(referralCode);
		} else {
			user = await User.create({
				fullName,
				email,
				password: "password",
				"avatar.url": avatarUrl,
			});
		}
	}

	user = await createWalletForUser(user._id);

	if (user.isBlocked) {
		return next(new ErrorHandler("You are Blocked", 200));
	}

	sendToken(user, 201, res, "userToken");
});

// @METHOD POST
// @PATH /user/create-user
const createUser = asyncErrorHandler(async (req, res, next) => {
	const { fullName, email, password, age, referralCode } = req.body;

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
		fullName,
		email,
		age,
		password,
		referralCode,
	};

	const createActivationToken = (user) => {
		return jwt.sign(user, process.env.ACTIVATION_SECRET, {
			expiresIn: "5m",
		});
	};

	const activationToken = createActivationToken(user);
	const activationUrl = `https://shopnexus.live/activation?activation_token=${activationToken}`;

	await sendMailHTML({
		email: user.email,
		subject: "Activate you Account account",
		html: activateAccountMail(user.fullName, activationUrl),
	});

	/* Can be removed, added so that don't have to check mail while testing */
	console.log(activationUrl);

	res.status(201).json({
		success: true,
		message: `Please check your email`,
	});
});

// @METHOD POST
// @PATH /user/activation
const activateUser = asyncErrorHandler(async (req, res, next) => {
	const { activation_token } = req.body;
	const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
	if (!newUser) return next("Invalid Token");

	const { fullName, email, password, age, profilePic, referralCode } = newUser;
	console.log(referralCode);

	const userExits = await User.findOne({ email });
	if (userExits) return;

	let dataUser;

	if (referralCode) {
		dataUser = await User.create({
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			"avatar.url": profilePic,
			referral: {
				viaReferral: true,
				viaReferralDetails: {
					code: referralCode,
				},
			},
		});
		await userCreatedViaReferral(referralCode);
	} else {
		dataUser = await User.create({
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			"avatar.url": profilePic,
		});
	}
	dataUser = await createWalletForUser(dataUser._id);

	sendToken(dataUser, 201, res);
});

// @METHOD GET
// @PATH /user/logout
const userLogOut = asyncErrorHandler(async (req, res, next) => {
	res.status(200).clearCookie("userToken").json({
		success: true,
		message: "User is Logged out",
	});
});

// @METHOD GET
// @PATH /user/user-details
const getUserDetails = asyncErrorHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

// @METHOD PUT
// @PATH /user/edit-user-details
const editUserDetails = asyncErrorHandler(async (req, res, next) => {
	const { email, fullName } = req.body;
	let user;

	user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ fullName, email },
		{ new: true }
	);

	if (req.file) {
		const fileUrl = `https://shopnexus.live/images/${req.file.filename}`;
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

// @METHOD POST
// @PATH /user/add-address
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

// @METHOD POST
// @PATH /user/remove-address
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

// @METHOD POST
// @PATH /user/set-default-address
const setDefaultAddress = asyncErrorHandler(async (req, res, next) => {
	const { addressId } = req.body;

	const user = await User.findOne({ _id: req.user.id });

	const newAddress = user.addresses.map((address) => {
		if (address._id == addressId) address.default = true;
		else address.default = false;
		return address;
	});

	const updatedUser = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			addresses: newAddress,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Default Address Changed",
		user: updatedUser,
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

// @METHOD GEt
// @PATH /user/get-wallet-details
const getWalletDetails = asyncErrorHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	if (!user.wallet) user = await createWalletForUser(req.user.id);

	const [pagination, transaction] = await findWithPaginationAndSorting(
		req,
		Transaction,
		{ personId: req.user.id }
	);

	res.status(200).json({
		success: true,
		balance: user.wallet.balance,
		pagination,
		transactions: transaction,
	});
});

// @METHOD PATCH
// @PATH /user/change-wallet-balance
const changeWalletBalance = asyncErrorHandler(async (req, res, next) => {
	const { amountToAdd, description } = req.body;

	if (amountToAdd < 0) {
		const user = await User.findOne({ _id: req.user.id });

		if (user.wallet.balance < amountToAdd * -1)
			return next(new ErrorHandler("Not enough Balance on Wallet", 401));
	}

	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ $inc: { "wallet.balance": amountToAdd } }
	);

	const transaction = await Transaction.create({
		personId: req.user.id,
		amount: amountToAdd,
		description,
	});

	res.status(200).json({
		success: true,
		balance: user.wallet.balance,
		transactions: transaction,
	});
});

// @METHOD PUT
// @PATH /user/start-referral
const startReferral = asyncErrorHandler(async (req, res, next) => {
	console.log("HIHI");

	const myCode = generateRandomId(8);
	const myReferrals = {
		count: 0,
		moneyViaReferral: 0,
	};

	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			referral: {
				myCode,
				myReferrals,
			},
		},
		{ new: true, upsert: true }
	);

	res.status(200).json({
		success: true,
		message: "Referral code generated",
		user,
	});
});

// @METHOD PUT
// @PATH /user/become-plus-member
const becomePlusMember = asyncErrorHandler(async (req, res, next) => {
	const plusMember = {
		active: true,
		details: req.body.details,
	};
	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			plusMember,
		},
		{ new: true, upsert: true }
	);

	res.status(200).json({
		success: true,
		message: "Plus membership activated",
	});
});

// @METHOD PUT
// @PATH /user/unsubscribe-plus-member
const removePlusMembership = asyncErrorHandler(async (req, res, next) => {
	const plusMember = {
		active: false,
		details: { info: "Unsubscribed from Nexus Plus", date: new Date() },
	};
	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			plusMember,
		},
		{ new: true, upsert: true }
	);
	res.status(200).json({
		success: true,
		message: "Plus membership deactivated",
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
	providerSignIn,
	getWalletDetails,
	becomePlusMember,
	removePlusMembership,
	changeWalletBalance,
	setDefaultAddress,
	startReferral,
};
