const express = require("express");
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const addToOrder = asyncErrorHandler(async (req, res, nex) => {
	const orderData = { orderId: uuidv4(), ...req.body.orderState };

	console.log(orderData);

	const data = await Order.create(orderData);
	console.log(data);

	res.status(200).json({
		success: true,
		data,
	});
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
	const orderId = req.params.orderId;

	const eventToAdd = {
		name: "Canceled",
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
	const orderData = await Order.find({
		"orderItems.shop": shopId,
	});
	res.status(200).json({
		success: true,
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

module.exports = {
	addToOrder,
	getAllOrders,
	getSingleOrders,
	getUsersAllOrders,
	cancelOrder,
	getSellerAllOrders,
	getSingleOrderDetailsForShop,
	changeOrderStatus,
};
