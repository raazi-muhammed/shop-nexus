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
	const orderData = await Order.find({});

	res.status(200).json({
		success: true,
		orderData,
	});
});

const getSingleOrders = asyncErrorHandler(async (req, res, next) => {
	const { orderId } = req.params;

	const orderData = await Order.findOne({ orderId }).populate(
		"orderItems.product"
	);
	console.log(orderData);

	res.status(200).json({
		success: true,
		orderData,
	});
});

const cancelOrder = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;
	//const orderData = await Order.find({ user: userId });

	res.status(200).json({
		success: true,
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

module.exports = {
	addToOrder,
	getAllOrders,
	getSingleOrders,
	getUsersAllOrders,
	cancelOrder,
};
