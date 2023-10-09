const express = require("express");
const path = require("path");
const router = express.Router();
const Products = require("../model/Products");

router.get("/all-products", async (req, res) => {
	try {
		let products = await Products.find({ isDeleted: { $ne: true } });
		res.status(200).json({
			success: true,
			products,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/best-selling", async (req, res) => {
	try {
		let products = await Products.find({ isDeleted: { $ne: true } }).sort({
			total_sell: -1,
		});
		res.status(200).json({
			success: true,
			products,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/single-product/:id", async (req, res) => {
	try {
		const productId = req.params.id;

		let productDetails = await Products.find({ _id: productId });
		res.status(200).json({
			success: true,
			productDetails,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.put("/edit-product/:id", async (req, res) => {
	try {
		const productId = req.params.id;
		const { productName, description, category, price, discountedPrice } =
			req.body;

		let productDetails = await Products.findOneAndUpdate(
			{ _id: productId },
			{
				name: productName,
				description,
				category,
				price,
				discount_price: discountedPrice,
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Product Update successful",
			productDetails,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: true,
			message: "Some Error",
			err,
		});
	}
});

router.delete("/delete-product/:id", async (req, res) => {
	try {
		const productId = req.params.id;

		let productDetails = await Products.findOneAndUpdate(
			{ _id: productId },
			{
				isDeleted: true,
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Product Deleted successful",
			productDetails,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: true,
			message: "Some Error",
			err,
		});
	}
});

router.post("/add-product", async (req, res) => {
	try {
		const {
			productName,
			category,
			description,
			price,
			discountedPrice,
			imageUrl,
			rating,
			stock,
			shopId,
			shopName,
		} = req.body;

		const productDataToAdd = {
			name: productName,
			category,
			description,
			price,
			discount_price: discountedPrice,
			images: [{ public_id: 0, url: imageUrl }],
			shop: {
				name: shopName,
				id: shopId,
			},
			rating,
			stock,
			total_sell: 0,
		};
		console.log(productDataToAdd);

		const productData = await Products.create(productDataToAdd);

		res.status(201).json({
			success: true,
			productData,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

module.exports = router;
