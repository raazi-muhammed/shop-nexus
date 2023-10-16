const express = require("express");
const Products = require("../model/Products");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const Shop = require("../model/Shop");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getBestSellingProducts = asyncErrorHandler(async (req, res, next) => {
	let products = await Products.find({ isDeleted: { $ne: true } }).sort({
		total_sell: -1,
	});

	res.status(200).json({
		success: true,
		products,
	});
});

const getProducts = asyncErrorHandler(async (req, res, next) => {
	let products = await Products.find({ isDeleted: { $ne: true } });
	res.status(200).json({
		success: true,
		products,
	});
});

const getProductByCategory = asyncErrorHandler(async (req, res, next) => {
	const { category } = req.params;
	let products = await Products.find({ isDeleted: { $ne: true }, category });
	res.status(200).json({
		success: true,
		products,
	});
});

const getProductsIncludingDeleted = asyncErrorHandler(
	async (req, res, next) => {
		let products = await Products.find({});
		res.status(200).json({
			success: true,
			products,
		});
	}
);

const getSingleProductDetails = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	let productDetails = await Products.find({ _id: productId });
	res.status(200).json({
		success: true,
		productDetails,
	});
});

const editProduct = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	const {
		productName,
		description,
		category,
		price,
		discountedPrice,
		stock,
		image,
	} = req.body;

	const imageUrls = await Promise.all(
		image.map(async (img, i) => {
			return {
				public_id: i,
				url: await cloudinaryUpload(img),
			};
		})
	);

	let productDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{
			name: productName,
			description,
			category,
			price,
			stock,
			discount_price: discountedPrice,
			$addToSet: { images: { $each: imageUrls } },
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Product Update successful",
		//productDetails,
	});
});

const deleteProductImage = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	const imageUrl = req.body.imgUrl;

	let productDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{ $pull: { images: { url: imageUrl } } },
		{ new: true }
	);
	res.status(200).json({
		success: true,
		message: "Removed Image",
	});
});

const deleteProductSeller = asyncErrorHandler(async (req, res, next) => {
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
});

const editProductAdmin = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	const { category, rating, totalSales, soldOut } = req.body;
	let productDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{
			category: category,
			rating: rating,
			sold_out: soldOut,
			total_sell: totalSales,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Product Update successful",
		productDetails,
	});
});

const recoverProduct = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;

	let productDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{
			isDeleted: false,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Product Recovered successful",
		productDetails,
	});
});

const addProduct = asyncErrorHandler(async (req, res, next) => {
	const {
		productName,
		category,
		description,
		price,
		discountedPrice,
		image,
		rating,
		stock,
		shopId,
		shopName,
	} = req.body;

	if (image.length === 0) {
		res.status(500).json({
			success: false,
			message: "Please Add at least one image",
		});
		return;
	}

	const imageUrls = await Promise.all(
		image.map(async (e, i) => {
			return {
				public_id: i,
				url: await cloudinaryUpload(e),
			};
		})
	);

	const productDataToAdd = {
		name: productName,
		category,
		description,
		price,
		discount_price: discountedPrice,
		images: imageUrls,
		shop: {
			name: shopName,
			id: shopId,
		},
		rating,
		stock,
		total_sell: 0,
	};

	const productData = await Products.create(productDataToAdd);

	res.status(201).json({
		success: true,
		message: "Product Added",
		productData,
	});
});

const getProductsFromShop = asyncErrorHandler(async (req, res, next) => {
	const ShopDetails = await Shop.find({ _id: req.params.shopId });
	const shopName = ShopDetails[0].shopName;

	const shopDetails = await Products.find({ "shop.name": shopName });
	res.status(200).json({
		success: true,
		data: shopDetails,
	});
});

const changeStockBasedOnOrder = asyncErrorHandler(async (req, res, next) => {
	const { stock, productId } = req;

	console.log("changeStockBasedOnOrder");
	console.log(stock, productId);
	const shopDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{ $inc: { stock: -stock } },
		{ new: true }
	);
	console.log(shopDetails);
	res.status(200).json({
		success: true,
		data: shopDetails,
	});
});

module.exports = {
	getBestSellingProducts,
	getProducts,
	getProductByCategory,
	getProductsIncludingDeleted,
	getSingleProductDetails,
	deleteProductImage,
	editProduct,
	deleteProductSeller,
	editProductAdmin,
	recoverProduct,
	addProduct,
	getProductsFromShop,
	changeStockBasedOnOrder,
};
