const express = require("express");
const Products = require("../model/Products");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const Shop = require("../model/Shop");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");
const Order = require("../model/Order");

// @METHOD GET
// @PATH /product/best-selling
const getBestSellingProducts = asyncErrorHandler(async (req, res, next) => {
	const [pagination, products] = await findWithPaginationAndSorting(
		req,
		Products,
		{
			isDeleted: { $ne: true },
			isBlocked: { $ne: true },
		}
	);

	res.status(200).json({
		success: true,
		products,
		pagination,
	});
});

// @METHOD GET
// @PATH /product/all-products
const getProducts = asyncErrorHandler(async (req, res, next) => {
	const [pagination, products] = await findWithPaginationAndSorting(
		req,
		Products,
		{
			isDeleted: { $ne: true },
			isBlocked: { $ne: true },
		}
	);

	res.status(200).json({
		success: true,
		products,
		pagination,
	});
});

// @METHOD GET
// @PATH /product/filter-products/:category
const getProductByCategory = asyncErrorHandler(async (req, res, next) => {
	const { category } = req.params;
	let products = await Products.find({
		isDeleted: { $ne: true },
		isBlocked: { $ne: true },
		category,
	});
	res.status(200).json({
		success: true,
		products,
	});
});

// @METHOD GET
// @PATH /product/search-products
const searchProducts = asyncErrorHandler(async (req, res, next) => {
	const { category, searchTerm, minPrice, maxPrice, rating } = req.query;
	let filter = {
		isDeleted: { $ne: true },
		isBlocked: { $ne: true },
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
	if (maxPrice) filter.discountPrice = { $lt: maxPrice };
	if (minPrice) filter.discountPrice = { $gt: minPrice };
	if (minPrice && maxPrice)
		filter.discountPrice = { $gt: minPrice, $lt: maxPrice };

	const [pagination, products] = await findWithPaginationAndSorting(
		req,
		Products,
		filter
	);

	res.status(200).json({
		success: true,
		pagination,
		products,
	});
});

// @METHOD GET
// @PATH /product/all-products-including-deleted
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

// @METHOD GET
// @PATH /product/single-product/:id
const getSingleProductDetails = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	let productDetails = await Products.find({ _id: productId }).populate(
		"shop.id"
	);

	res.status(200).json({
		success: true,
		productDetails,
	});
});

// @METHOD PUT
// @PATH /product/edit-product/:id
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
			discountPrice: discountedPrice,
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

// @METHOD PUT
// @PATH /product/delete-product-image/:id
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

// @METHOD DELETE
// @PATH /product/delete-product/:id
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

// @METHOD PUT
// @PATH /product/edit-product-admin/:id
const editProductAdmin = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.id;
	const { category, rating, totalSales, soldOut } = req.body;
	let productDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{
			category: category,
			rating: rating,
			soldOut: soldOut,
			totalSell: totalSales,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Product Update successful",
		productDetails,
	});
});

// @METHOD DELETE
// @PATH /product/recover-product/:id
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

// @METHOD POST
// @PATH /product/add-product
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
		discountPrice: discountedPrice,
		images: imageUrls,
		shop: {
			name: shopName,
			id: shopId,
		},
		rating,
		stock,
	};

	const productData = await Products.create(productDataToAdd);

	res.status(201).json({
		success: true,
		message: "Product Added",
		productData,
	});
});

// @METHOD GET
// @PATH /product/get-products-from-shop
// @PATH /product/get-products-from-shop/:shopId
const getProductsFromShop = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.shop._id;
	const ShopDetails = await Shop.findOne({ _id: shopId });
	const shopName = ShopDetails.shopName;

	const [pagination, shopProducts] = await findWithPaginationAndSorting(
		req,
		Products,
		{
			isDeleted: { $ne: true },
			"shop.name": shopName,
		}
	);

	res.status(200).json({
		success: true,
		pagination,
		data: shopProducts,
	});
});

// @METHOD PATCH
// @PATH /product/change-stock-value
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

const changeStockBasedOnOrder = async (productId, stock) => {
	const shopDetails = await Products.findOneAndUpdate(
		{ _id: productId },
		{ $inc: { stock: -stock, total_sell: stock } },
		{ new: true }
	);
};

// @METHOD GET
// @PATH /product/can-user-place-review/:productId
const changeUserPlaceReviewOnProduct = asyncErrorHandler(
	async (req, res, next) => {
		const userId = req.user.id;
		const productId = req.params.productId;

		const review = await Order.findOne({
			user: userId,
			orderItems: { $elemMatch: { product: productId } },
			$or: [{ status: "DELIVERED" }, { status: "RETURN_APPROVED" }],
		});

		if (review) {
			res.status(200).json({
				success: true,
				canPostReview: true,
				message: "Please post a review",
			});
		} else {
			res.status(200).json({
				success: true,
				canPostReview: false,
				message: "Buy the product to post a review",
			});
		}
	}
);

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
	changeUserPlaceReviewOnProduct,
};
