const express = require("express");
const router = express.Router();
const Shop = require("../model/Shop");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const Products = require("../model/Products");
const { upload } = require("../multer");
const fs = require("fs");
const { isSellerAuthenticated } = require("../middleware/sellerAuth");

router.post("/crate-shop", async (req, res) => {
	try {
		if (req.body.password !== req.body.confirmPassword) {
			res.status(400).json({
				success: 400,
				message: "Password doesn't match",
			});
			return;
		}

		if (req.body.password.length < 6) {
			res.status(400).json({
				success: 400,
				message: "Password must be at least 6 characters",
			});
			return;
		}

		const shopAlreadyExists = await Shop.findOne({
			$or: [{ shopName: req.body.shopName }, { email: req.body.email }],
		});

		if (shopAlreadyExists) {
			res.status(400).json({
				success: 400,
				message: "Shop name or Email taken",
			});
			return;
		}

		const shop = {
			shopName: req.body.shopName,
			email: req.body.email,
			zipCode: req.body.zipCode,
			phoneNumber: req.body.phoneNumber,
			address1: req.body.address1,
			address2: req.body.address2,
			password: req.body.password,
			gstinNumber: req.body.gstinNumber,
		};

		const createActivationToken = (shop) => {
			return jwt.sign(shop, process.env.ACTIVATION_SECRET, {
				expiresIn: "5m",
			});
		};
		const activationToken = createActivationToken(shop);
		const activationUrl = `http://localhost:5173/api/v1/seller/activation?activation_token=${activationToken}`;

		/* Can be removed, added so that don't have to check mail while testing */
		console.log(activationUrl);

		await sendMail({
			email: shop.email,
			subject: "Activate you Seller Account account",
			message: `Click to activate ${activationUrl}`,
		});
		res.status(201).json({
			success: true,
			message: `Please check your email`,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.post("/activation", async (req, res) => {
	try {
		const { activation_token } = req.body;
		const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
		const {
			shopName,
			zipCode,
			email,
			phoneNumber,
			address1,
			address2,
			password,
			gstinNumber,
		} = newUser;

		if (!newUser) {
			res.status(400).json({
				success: false,
				message: "Invalid Token",
			});
			return next("Invalid Token");
		}

		const dataUser = await Shop.create({
			shopName,
			email,
			zipCode,
			phoneNumber,
			address1,
			address2,
			password,
			GSTIN_Number: gstinNumber,
		});

		sendToken(dataUser, 201, res);
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message || "Internal Server Error",
		});
	}
});

router.post("/login-shop", async (req, res) => {
	try {
		let shop = await Shop.findOne(
			{ email: req.body.email },
			{ password: 1, email: 1, fullName: 1, role: 1 } // used projection because other password is not returend
		);

		if (!shop) {
			res.status(404).json({
				success: false,
				message: "No user found",
			});
			return;
		}

		let isPasswordMatch = await shop.comparePassword(req.body.password);
		if (!isPasswordMatch) {
			res.status(404).json({
				success: false,
				message: "Incorrect Password",
			});
			return;
		}
		sendToken(shop, 201, res, "sellerToken");
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal Serer Error",
		});
	}
});

router.get("/get-shop-details/:id", async (req, res) => {
	try {
		const shopId = req.params.id;

		const shopDetails = await Shop.findOne({ _id: shopId });
		res.status(200).json({
			success: true,
			data: shopDetails,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: true,
			message: "Failed to get shop details",
		});
	}
});

router.put(
	"/edit-shop-details",
	isSellerAuthenticated,
	upload.single("file"),
	async (req, res) => {
		try {
			const {
				shopId,
				zipCode,
				address1,
				address2,
				phoneNumber,
				email,
				shopName,
				gstinNumber,
			} = req.body;

			let shopDetails;
			shopDetails = await Shop.findOneAndUpdate(
				{ _id: shopId },
				{
					zipCode,
					address1,
					address2,
					phoneNumber,
					email,
					shopName,
					GSTIN_Number: gstinNumber,
				},
				{ new: true } //for return updated file
			);

			if (req.file) {
				const fileUrl = `http://localhost:3000/images/${req.file.filename}`;
				shopDetails = await Shop.findOneAndUpdate(
					{ _id: shopId },
					{ $set: { "image.url": fileUrl } },
					{ new: true, upsert: true }
				);
			}

			res.status(200).json({
				success: true,
				message: "Update Successful",
				shopData: shopDetails,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({
				success: false,
				message: err || "Internal Server Error",
			});
		}
	}
);

router.get(
	"/get-products-from-shop/:shopId",
	isSellerAuthenticated,
	async (req, res) => {
		const ShopDetails = await Shop.find({ _id: req.params.shopId });
		const shopName = ShopDetails[0].shopName;

		const shopDetails = await Products.find({ "shop.name": shopName });
		res.status(200).json({
			success: true,
			data: shopDetails,
		});
	}
);

router.get("/logout", (req, res) => {
	try {
		res.status(200).clearCookie("sellerToken").json({
			success: true,
			message: "User is Logged out",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

module.exports = router;
