const express = require("express");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const Razorpay = require("razorpay");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/User");
const instance = new Razorpay({
	key_id: process.env.RAZORPAY_API_KEY,
	key_secret: process.env.RAZORPAY_API_SECRET,
});

// @METHOD GET
// @PATH /payment/subscription-details/:subscriptionId
const getSubscriptionDetails = asyncErrorHandler(async (req, res, next) => {
	const { subscriptionId } = req.params;
	const subscriptionDetails = await instance.subscriptions.fetch(
		subscriptionId
	);
	if (!subscriptionDetails)
		return next(new ErrorHandler("Some error occurred", 500));

	res.status(200).json({
		success: true,
		subscriptionDetails,
	});
});

// @METHOD POST
// @PATH /payment/shop-nexus-plus
const subscribeToNexusPlus = asyncErrorHandler(async (req, res, next) => {
	const options = {
		plan_id: process.env.PLUS_RAZORPAY_PLAN_ID,
		total_count: 999,
		quantity: 1,
	};

	const order = await instance.subscriptions.create(options);
	if (!order) return next(new ErrorHandler("Some error occurred", 500));

	res.status(200).json({
		success: true,
		order,
	});
});

// @METHOD PUT
// @PATH /payment/cancel-subscription
const cancelSubscription = asyncErrorHandler(async (req, res, next) => {
	const { subscriptionId, userId } = req.body;

	const userExists = await User.findOne({ _id: userId });
	if (!userExists) return next(new ErrorHandler("No user found", 400));

	const subscriptionDetails = await instance.subscriptions.cancel(
		subscriptionId
	);

	if (!subscriptionDetails)
		return next(new ErrorHandler("Some error occurred", 500));

	const plusMember = {
		active: false,
		details: { info: "Unsubscribed from Nexus Plus", date: new Date() },
	};
	const user = await User.findOneAndUpdate(
		{ _id: userId },
		{
			plusMember,
		},
		{ new: true, upsert: true }
	);

	res.status(200).json({
		success: true,
		subscriptionDetails,
		user,
		message: "Deactivation Successful",
	});
});

// @METHOD POST
// @PATH /payment/create-razorpay-order
const createRazorPayOrder = asyncErrorHandler(async (req, res, next) => {
	const options = {
		amount: req.body.amount * 100,
		currency: "INR",
		receipt: "receipt#1",
	};

	const order = await instance.orders.create(options);
	if (!order) return next(new ErrorHandler("Some error occurred", 500));

	res.status(200).json({
		success: true,
		order,
	});
});

module.exports = {
	getSubscriptionDetails,
	subscribeToNexusPlus,
	cancelSubscription,
	createRazorPayOrder,
};
