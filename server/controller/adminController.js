const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Shop = require("../model/Shop");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Order = require("../model/Order");
const Products = require("../model/Products");

// @METHOD POST
// @PATH /admin/login
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

// @METHOD POST
// @PATH /admin/logout
const adminLogOut = asyncErrorHandler(async (req, res, next) => {
	res.status(200).clearCookie("adminDetails").json({
		success: true,
		message: "User is Logged out",
	});
});

// @METHOD GET
// @PATH /admin/get-user
const getAllUsers = asyncErrorHandler(async (req, res, next) => {
	const userData = await User.find({});
	res.status(200).json({
		success: true,
		userDetails: userData,
	});
});

// @METHOD GET
// @PATH /admin/get-sellers
const getAllSellers = asyncErrorHandler(async (req, res, next) => {
	const shopData = await Shop.find({});
	res.status(200).json({
		success: true,
		shopDetails: shopData,
	});
});

// @METHOD POST
// @PATH /admin/block-seller
const adminBlockAndUnBlockSeller = asyncErrorHandler(async (req, res) => {
	const { id, action } = req.body;
	const userData = await Shop.findOneAndUpdate(
		{ _id: id },
		{ isBlocked: action },
		{ new: true, upsert: true }
	);

	await Products.updateMany(
		{ "shop.id": id },
		{ isBlocked: action },
		{ new: true, upsert: true }
	);

	res.status(200).json({
		success: true,
		message: action ? "Blocked user" : "Unblocked User",
		userDetails: userData,
	});
});

// @METHOD POST
// @PATH /admin/block-user
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

const getContentForDashBoardBetweenDates = async (startDate, endDate) => {
	return await Order.aggregate([
		{
			$match: {
				createdAt: { $lt: startDate, $gt: endDate },
			},
		},
		{
			$group: {
				_id: "Seven Days",
				orders: { $sum: 1 },
				revenue: { $sum: "$totalPrice" },
				delivered: {
					$sum: {
						$cond: { if: { $eq: ["$status", "Delivered"] }, then: 1, else: 0 },
					},
				},
			},
		},
		{
			$sort: { _id: 1 },
		},
		{
			$project: {
				_id: 0,
			},
		},
	]);
};

// @METHOD GET
// @PATH /admin/chart/orders
const getOrdersSoldChartDataAdmin = asyncErrorHandler(
	async (req, res, next) => {
		const { startDate, endDate } = req.query;

		const matchOptions = {};

		const groupOptions = {
			_id: "$status",
			count: { $sum: 1 },
			totalPrice: { $sum: "$totalPrice" },
		};

		const _startDate = new Date(startDate);
		const _endDate = new Date(endDate);

		if (!isNaN(_startDate)) {
			matchOptions.createdAt = { $gt: _startDate };
		}
		if (!isNaN(_endDate)) {
			matchOptions.createdAt = { $lt: _endDate };
		}

		if (!isNaN(_endDate) && !isNaN(_startDate)) {
			matchOptions.createdAt = { $lt: _endDate, $gt: _startDate };
		}

		const products = await Order.aggregate([
			{
				$match: matchOptions,
			},
			{
				$group: groupOptions,
			},
			{
				$sort: { _id: 1 },
			},
		]);

		res.status(200).json({
			success: true,
			chartData: products,
		});
	}
);

// @METHOD GET
// @PATH /admin/chart/sales
const getSalesChartDataAdmin = asyncErrorHandler(async (req, res, next) => {
	const { categorizeBy, startDate, endDate } = req.query;

	const matchOptions = {};

	const groupOptions = {
		_id: {
			year: { $year: "$createdAt" },
		},
		count: { $sum: 1 },
		totalPrice: { $sum: "$totalPrice" },
	};

	const _startDate = new Date(startDate);
	const _endDate = new Date(endDate);

	if (!isNaN(_startDate)) {
		matchOptions.createdAt = { $gt: _startDate };
	}
	if (!isNaN(_endDate)) {
		matchOptions.createdAt = { $lt: _endDate };
	}

	if (!isNaN(_endDate) && !isNaN(_startDate)) {
		matchOptions.createdAt = { $lt: _endDate, $gt: _startDate };
	}

	if (categorizeBy === "MONTH" || categorizeBy === "DAY") {
		groupOptions._id.month = { $month: "$createdAt" };
	}
	if (categorizeBy === "DAY") {
		groupOptions._id.day = { $dayOfMonth: "$createdAt" };
	}

	const products = await Order.aggregate([
		{
			$match: matchOptions,
		},
		{
			$group: groupOptions,
		},
		{
			$sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
		},
	]);

	res.status(200).json({
		success: true,
		chartData: products,
	});
});

// @METHOD GET
// @PATH /admin/chart/dashboard
const getDashBoardContentAdmin = asyncErrorHandler(async (req, res, next) => {
	const today = new Date();
	const before7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const before14days = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
	const before30days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const before60days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

	const sevenDaysPromise = getContentForDashBoardBetweenDates(
		today,
		before7days
	);
	const previousSevenDaysPromise = getContentForDashBoardBetweenDates(
		before7days,
		before14days
	);

	const thirtyDaysPromise = getContentForDashBoardBetweenDates(
		today,
		before30days
	);
	const previousThirtyDaysPromise = getContentForDashBoardBetweenDates(
		before30days,
		before60days
	);
	const [sevenDays, previousSevenDays, thirtyDays, previousThirtyDays] =
		await Promise.all([
			sevenDaysPromise,
			previousSevenDaysPromise,
			thirtyDaysPromise,
			previousThirtyDaysPromise,
		]);

	const data = {
		sevenDays: sevenDays[0],
		previousSevenDays: previousSevenDays[0],
		thirtyDays: thirtyDays[0],
		previousThirtyDays: previousThirtyDays[0],
	};

	res.status(200).json({
		success: true,
		data,
	});
});

module.exports = {
	adminLogOut,
	adminLogIn,
	getAllUsers,
	adminBlockAndUnBlockUser,
	getAllSellers,
	adminBlockAndUnBlockSeller,
	getDashBoardContentAdmin,
	getSalesChartDataAdmin,
	getOrdersSoldChartDataAdmin,
};
