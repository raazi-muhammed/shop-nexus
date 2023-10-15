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

module.exports = { addToOrder };
