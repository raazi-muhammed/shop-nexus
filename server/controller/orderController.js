const express = require("express");
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const convertISOToDate = require("../utils/convertISOToDate");
const addToOrder = asyncErrorHandler(async (req, res, nex) => {
	const orderData = { orderId: uuidv4(), ...req.body.orderState };

	const data = await Order.create(orderData);

	res.status(200).json({
		success: true,
		data,
	});
});

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Order.estimatedDocumentCount({});

	const orderDataPromise = Order.find({})
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

	res.status(200).json({
		success: true,
		message: "Order Cancelation Successful",
		orderData,
	});
});

const getUsersAllOrders = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;
	const orderData = await Order.find({ user: userId });

	res.status(200).json({
		success: true,
		orderData,
	});
});

const getSellerAllOrders = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.params.shopId;
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Order.estimatedDocumentCount({});

	const orderDataPromise = Order.find({
		"orderItems.shop": shopId,
	})
		.sort({ createdAt: -1 })
		.limit(ITEMS_PER_PAGE)
		.skip(skip);

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
};
