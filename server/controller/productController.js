const express = require("express");
const path = require("path");
const router = express.Router();
const Products = require("../model/Products");

router.get("/all-products", async (req, res) => {
	console.log("all products");
	let data = await Products.find({});
	//console.log(data);
	res.status(200).json(data);
	return data;
});

router.get("/best-selling", async (req, res) => {
	console.log("best selling");
	let data = await Products.find({}).sort({ total_sell: -1 });
	//console.log(data);
	res.status(200).json(data);
	return data;
});

module.exports = router;
