const express = require("express");
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const fs = require("fs");
const convertISOToDate = require("../utils/convertISOToDate");
const { changeStockBasedOnOrder } = require("./productController");
const User = require("../model/User");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");
const Shop = require("../model/Shop");
const {
	createTransaction,
	changerUserWalletBalanceWithTransaction,
	changerSellerWalletBalanceWithTransaction,
} = require("./transactionController");
const Products = require("../model/Products");

const refundedToUser = async (orderId, productOrderId) => {
	const orderData = await Order.findOne({ orderId, _id: productOrderId });
	if (orderData.paymentInfo.status === "Received") {
		changerUserWalletBalanceWithTransaction(
			orderData.user,
			orderData.totalPrice,
			"Refunded from an Order"
		);
		changerSellerWalletBalanceWithTransaction(
			orderData.orderItems[0].shop,
			orderData.totalPrice * -1,
			`Added via Order ${orderData.orderId}`
		);
	}
};

const addToOrder = asyncErrorHandler(async (req, res, next) => {
	const orderData = { orderId: uuidv4(), ...req.body.orderState };

	const detailsOfOrderPromises = orderData.orderItems.map(
		async (singleOrder) => {
			// Checks for Stock
			const productDetails = await Products.findOne({
				_id: singleOrder.product,
			});

			if (productDetails.stock > singleOrder.quantity) {
				await changeStockBasedOnOrder(
					singleOrder.product,
					singleOrder.quantity
				);

				// Created separate Orders based on Shop
				const newOrderData = {
					...orderData,
					orderItems: [
						{
							...singleOrder,
						},
					],
					totalPrice: singleOrder.price,
				};

				// Add money to Shop Wallet
				if (newOrderData.paymentInfo.status === "Received") {
					changerSellerWalletBalanceWithTransaction(
						singleOrder.shop,

						`Added via Order ${orderData.orderId}`
					);
				}
				await Order.create(newOrderData);

				return {
					name: productDetails.name,
					success: true,
					status: "Order Placed",
				};
			} else {
				return {
					name: productDetails.name,
					success: false,
					status: "Order Not Placed (Out of Stock)",
				};
			}
		}
	);
	const detailsOfOrder = await Promise.all(detailsOfOrderPromises);

	res.status(200).json({
		success: true,
		message: "Order Placed",
		details: detailsOfOrder,
	});
});

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Order.estimatedDocumentCount({});

	const orderDataPromise = Order.find({})
		.populate("orderItems.product")
		.limit(ITEMS_PER_PAGE)
		.skip(skip)
		.sort({ createdAt: -1 });

	const [count, orderData] = await Promise.all([
		countPromise,
		orderDataPromise,
	]);

	const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
	const startIndex = ITEMS_PER_PAGE * page - ITEMS_PER_PAGE;

	res.status(200).json({
		success: true,
		pagination: {
			count,
			page,
			pageCount,
			startIndex,
		},
		orderData,
	});
});

const getSingleOrders = asyncErrorHandler(async (req, res, next) => {
	const { orderId } = req.params;

	const orderData = await Order.find({ orderId })
		.populate("orderItems.product")
		.populate("orderItems.shop");

	res.status(200).json({
		success: true,
		orderData,
	});
});

const cancelOrder = asyncErrorHandler(async (req, res, next) => {
	const orderId = req.params.orderId;

	console.log(req.body.productOrderId);
	await refundedToUser(orderId, req.body.productOrderId);

	const eventToAdd = {
		name: "Canceled",
		description: req.body.description,
	};

	const orderData = await Order.findOneAndUpdate(
		{ orderId, _id: req.body.productOrderId },
		{
			$addToSet: { events: eventToAdd },
			status: "Canceled",
		}
	);

	orderData.orderItems.map((e) => {
		changeStockBasedOnOrder(e.product, e.quantity * -1);
	});

	res.status(200).json({
		success: true,
		message: "Order Cancelation Successful",
		orderData,
	});
});

const returnOrder = asyncErrorHandler(async (req, res, next) => {
	const orderId = req.params.orderId;
	const eventToAdd = {
		name: "Returned",
		description: req.body.description,
	};

	const orderData = await Order.findOneAndUpdate(
		{ _id: req.body.productOrderId },
		{
			$addToSet: { events: eventToAdd },
			status: "Processing Return",
		}
	);

	orderData.orderItems.map((e) => {
		changeStockBasedOnOrder(e.product, e.quantity * -1);
	});

	res.status(200).json({
		success: true,
		message: "Order Returning on Processing",
		orderData,
	});
});

const getUsersAllOrders = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;

	const [pagination, orderData] = await findWithPaginationAndSorting(
		req,
		Order,
		{
			user: userId,
		},
		"orderItems.product"
	);

	res.status(200).json({
		success: true,
		pagination,
		orderData,
	});
});

const getSellerAllOrders = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.params.shopId;

	const [pagination, orderData] = await findWithPaginationAndSorting(
		req,
		Order,
		{
			"orderItems.shop": shopId,
		},
		"orderItems.product"
	);

	res.status(200).json({
		success: true,
		pagination,
		orderData,
	});
});

const getSalesReport = asyncErrorHandler(async (req, res, next) => {
	const { shopId } = req.params;
	const { dataFrom } = req.query;

	const today = new Date();
	let filterDate = new Date(2020, 0, 0);
	let dataFromDisplay = "All Time";

	if (dataFrom === "THIS_MONTH") {
		filterDate = new Date(today.getFullYear(), today.getMonth(), 1);
		const month = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		dataFromDisplay = `${month[today.getMonth()]}, ${today.getFullYear()}`;
	}

	if (dataFrom === "THIS_YEAR") {
		filterDate = new Date(today.getFullYear(), 1, 1);
		dataFromDisplay = `${today.getFullYear()}`;
	}

	const salesReport = await Order.find({
		"orderItems.shop": shopId,
		createdAt: { $gt: filterDate },
	})
		.sort({ createdAt: -1 })
		.populate("orderItems.product")
		.populate("user");

	res.status(200).json({
		success: true,
		salesReport,
		dataFromDisplay,
	});
});

const getSalesReportAdmin = asyncErrorHandler(async (req, res, next) => {
	const { dataFrom } = req.query;

	const today = new Date();
	let filterDate = new Date(2020, 0, 0);
	let dataFromDisplay = "All Time";

	if (dataFrom === "THIS_MONTH") {
		filterDate = new Date(today.getFullYear(), today.getMonth(), 1);
		const month = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		dataFromDisplay = `${month[today.getMonth()]}, ${today.getFullYear()}`;
	}

	if (dataFrom === "THIS_YEAR") {
		filterDate = new Date(today.getFullYear(), 1, 1);
		dataFromDisplay = `${today.getFullYear()}`;
	}

	const salesReport = await Order.find({
		createdAt: { $gt: filterDate },
	})
		.sort({ createdAt: -1 })
		.populate("orderItems.product")
		.populate("user");

	res.status(200).json({
		success: true,
		salesReport,
		dataFromDisplay,
	});
});

const getSingleOrderDetailsForShop = asyncErrorHandler(
	async (req, res, next) => {
		const { orderId, shopId } = req.params;

		const orderData = await Order.find({
			orderId,
			"orderItems.shop": shopId,
		})
			.populate("orderItems.product")
			.populate("orderItems.shop");

		res.status(200).json({
			success: true,
			orderData,
		});
	}
);

const changeOrderStatus = asyncErrorHandler(async (req, res, next) => {
	const { orderId } = req.params;
	const { orderStatus, productOrderId } = req.body;

	if (orderStatus === "Return Approved")
		await refundedToUser(orderId, productOrderId);

	const eventToAdd = {
		name: orderStatus,
	};

	const orderData = await Order.updateMany(
		{ orderId },
		{
			$addToSet: { events: eventToAdd },
			status: orderStatus,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Status Changed",
		orderData,
	});
});

module.exports = {
	addToOrder,
	getAllOrders,
	getSingleOrders,
	getUsersAllOrders,
	cancelOrder,
	getSellerAllOrders,
	getSingleOrderDetailsForShop,
	changeOrderStatus,
	returnOrder,
	getSalesReport,
	getSalesReportAdmin,
};
