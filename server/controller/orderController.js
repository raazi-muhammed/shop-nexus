const express = require("express");
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const convertISOToDate = require("../utils/convertISOToDate");
const { changeStockBasedOnOrder } = require("./productController");
const User = require("../model/User");
const { changeWalletBalance } = require("./userController");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");
const { changeWalletBalanceSeller } = require("./sellerController");

const refundedToUser = async (orderId) => {
	const orderData = await Order.findOne({ orderId });
	if (orderData.paymentInfo.status === "Received") {
		const eventToAdd = {
			amount: orderData.totalPrice,
			description: "Refunded from an Order",
		};
		const user = await User.findOneAndUpdate(
			{ _id: orderData.user },
			{
				$inc: { "wallet.balance": eventToAdd.amount },
				$addToSet: { "wallet.events": eventToAdd },
			},
			{ new: true, upsert: true }
		);
	}
};

const addToOrder = asyncErrorHandler(async (req, res, next) => {
	const orderData = { orderId: uuidv4(), ...req.body.orderState };

	orderData.orderItems.map(async (singleOrder) => {
		// Created separate Orders based on Shop
		const newOrderData = {
			...orderData,
			orderItems: [
				{
					...singleOrder,
				},
			],
			totalPrice: singleOrder.totalPrice,
		};
		await Order.create(newOrderData);

		// Add money to Shop Wallet
		if (newOrderData.paymentInfo.status === "Received") {
			req.body = {
				amountToAdd: singleOrder.totalPrice,
				description: `Added via Order ${orderData.orderId}`,
			};
			req.seller = { _id: singleOrder.shop };
			changeWalletBalanceSeller(req, res, next);
		}
	});

	res.status(200).json({
		success: true,
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

	const orderData = await Order.findOne({ orderId }).populate(
		"orderItems.product"
	);

	res.status(200).json({
		success: true,
		orderData,
	});
});

const cancelOrder = asyncErrorHandler(async (req, res, next) => {
	const orderId = req.params.orderId;

	await refundedToUser(orderId);

	const eventToAdd = {
		name: "Canceled",
		description: req.body.description,
	};

	const orderData = await Order.findOneAndUpdate(
		{ orderId },
		{
			$addToSet: { events: eventToAdd },
			status: "Canceled",
		}
	);

	console.log(orderData);
	orderData.orderItems.map((e) => {
		req.stock = e.quantity * -1;
		req.productId = e.product;
		changeStockBasedOnOrder(req, res, next);
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
		{ orderId },
		{
			$addToSet: { events: eventToAdd },
			status: "Processing Return",
		}
	);

	console.log(orderData);
	orderData.orderItems.map((e) => {
		req.stock = e.quantity * -1;
		req.productId = e.product;
		changeStockBasedOnOrder(req, res, next);
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

const getSingleOrderDetailsForShop = asyncErrorHandler(
	async (req, res, next) => {
		const { orderId, shopId } = req.params;

		const orderData = await Order.findOne({ orderId }).populate(
			"orderItems.product"
		);

		//filtering products that are only from the seller
		const newProducts = orderData.orderItems.filter((e) => e.shop == shopId);
		const newOrderData = {
			...orderData._doc,
			orderItems: newProducts,
		};

		res.status(200).json({
			success: true,
			orderData: newOrderData,
		});
	}
);

const changeOrderStatus = asyncErrorHandler(async (req, res, next) => {
	const { orderId } = req.params;
	const { orderStatus } = req.body;

	if (orderStatus === "Return Approved") await refundedToUser(orderId);

	const eventToAdd = {
		name: orderStatus,
	};

	const orderData = await Order.findOneAndUpdate(
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

const invoiceGenerator = asyncErrorHandler(async (req, res, next) => {
	const orderId = req.params.orderId;

	const orderData = await Order.findOne({ orderId }).populate(
		"orderItems.product"
	);

	const productsDetails = orderData.orderItems.map((e) => {
		return {
			quantity: e.quantity,
			description: e.product.name,
			"tax-rate": 0,
			price: e.product.discount_price,
		};
	});

	var data = {
		customize: {},
		images: {
			//logo: "https://res.cloudinary.com/dklhubdqw/image/upload/f_auto,q_auto/v1/Icons/segkwc2zh2bn9hajlutb",
		},
		// Your own data
		sender: {
			company: "Shop Nexus",
			address: "123 Main Address",
			zip: "6793823",
			city: "Calicut",
			country: "Kerala",
		},
		// Your recipient
		client: {
			company: orderData.shippingAddress.fullName,
			address: orderData.shippingAddress.address1,
			zip: orderData.shippingAddress.pinCode,
			city: orderData.shippingAddress.address2,
			country: orderData.shippingAddress.city,
		},
		information: {
			// Invoice number
			number: orderData.orderId.slice(0, 8),
			// Invoice data
			date: convertISOToDate(new Date()),
			// Invoice due date
			"due-date": convertISOToDate(new Date()),
		},

		products: productsDetails,

		//"bottom-notice": "Kindly pay your invoice within 15 days.",

		settings: { currency: "INR" },

		translate: {
			vat: "Discount", // Defaults to 'vat'
		},
	};

	const result = await easyinvoice.createInvoice(data);

	res.status(200).json({
		success: true,
		result,
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
	invoiceGenerator,
	returnOrder,
};
