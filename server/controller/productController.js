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

const searchProducts = asyncErrorHandler(async (req, res, next) => {
	console.log(req.query, "hihi");
	const { category, searchTerm, minPrice, maxPrice, rating } = req.query;

	let filter = {
		isDeleted: { $ne: true },
	};

	if (searchTerm) {
		filter.$or = [
			{
				name: { $regex: searchTerm, $options: "i" },
			},
			{
				description: { $regex: searchTerm, $options: "i" },
			},
		];
	}

	if (category) filter.category = category;
	if (rating) filter.rating = { $gte: rating };
	if (maxPrice) filter.discount_price = { $lt: maxPrice };
	if (minPrice) filter.discount_price = { $gt: minPrice };
	if (minPrice && maxPrice)
		filter.discount_price = { $gt: minPrice, $lt: maxPrice };

	console.log(filter);

	let products = await Products.find(filter);
	res.status(200).json({
		success: true,
		products,
	});
});

const getProductsIncludingDeleted = asyncErrorHandler(
	async (req, res, next) => {
		const ITEMS_PER_PAGE = 10;
		const { page } = req.query;
		const skip = (page - 1) * ITEMS_PER_PAGE;
		const countPromise = Products.estimatedDocumentCount({});

		let productsPromise = Products.find({}).limit(ITEMS_PER_PAGE).skip(skip);

		const [products, count] = await Promise.all([
			productsPromise,
			countPromise,
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

	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Products.estimatedDocumentCount();

	const shopProductsPromise = Products.find({ "shop.name": shopName })
		.limit(ITEMS_PER_PAGE)
		.skip(skip);

	const [shopProducts, count] = await Promise.all([
		shopProductsPromise,
		countPromise,
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
		data: shopProducts,
	});
});

const setNewStockAmount = asyncErrorHandler(async (req, res, next) => {
	const { stock, productId } = req.body;
	const products = await Products.findOneAndUpdate(
		{ _id: productId },
		{ stock: stock },
		{ new: true }
	);

	res.status(200).json({
		success: true,
		data: products,
	});
});

const changeStockBasedOnOrder = asyncErrorHandler(async (req, res, next) => {
	const { stock, productId } = req;

	const shopDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{ $inc: { stock: -stock } },
		{ new: true }
	);

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
	setNewStockAmount,
	searchProducts,
};
