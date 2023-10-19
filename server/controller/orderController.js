const express = require("express");
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const addToOrder = asyncErrorHandler(async (req, res, nex) => {
	const orderData = { orderId: uuidv4(), ...req.body.orderState };

	console.log(orderData);

	const data = await Order.create(orderData);
	console.log(data);
});

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Order.estimatedDocumentCount({});

	const orderDataPromise = Order.find({}).limit(ITEMS_PER_PAGE).skip(skip);

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
	console.log(orderId);
	console.log("Hihihi");

	const orderData = await Order.findOne({ orderId }).populate(
		"orderItems.product"
	);
	console.log(orderData);

	res.status(200).json({
		success: true,
		orderData,
	});
});

module.exports = { addToOrder, getAllOrders, getSingleOrders };
