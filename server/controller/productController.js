const express = require("express");
const path = require("path");
const router = express.Router();
const Products = require("../model/Products");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const sharp = require("sharp");
const { isSellerAuthenticated } = require("../middleware/sellerAuth");
const { isAdminAuthenticated } = require("../middleware/adminAuth");
const Shop = require("../model/Shop");

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

router.get("/all-products-including-deleted", async (req, res) => {
	try {
		let products = await Products.find({});
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

router.put("/edit-product/:id", isSellerAuthenticated, async (req, res) => {
	try {
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
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Some Error",
			err,
		});
	}
});

router.put(
	"/delete-product-image/:id",
	isAdminAuthenticated,
	async (req, res) => {
		try {
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
		} catch (err) {
			console.log(err);
			res.status(500).json({
				success: false,
				message: "Image not removed",
			});
		}
	}
);

router.put(
	"/edit-product-admin/:id/",
	isAdminAuthenticated,
	async (req, res) => {
		try {
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
		} catch (err) {
			console.log(err);
			res.status(500).json({
				success: true,
				message: "Some Error",
				err,
			});
		}
	}
);

router.delete(
	"/delete-product/:id",
	isSellerAuthenticated,
	async (req, res) => {
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
	}
);

router.post("/add-product", isSellerAuthenticated, async (req, res) => {
	try {
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
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/get-products-from-shop/:shopId", async (req, res) => {
	try {
		const ShopDetails = await Shop.find({ _id: req.params.shopId });
		const shopName = ShopDetails[0].shopName;

		const shopDetails = await Products.find({ "shop.name": shopName });
		res.status(200).json({
			success: true,
			data: shopDetails,
		});
	} catch (err) {
		console.log(err);
		res.status(200).json({
			success: true,
			message: "Internal Server Error",
		});
	}
});

module.exports = router;
