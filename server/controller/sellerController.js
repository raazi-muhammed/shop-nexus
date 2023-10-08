const express = require("express");
const router = express.Router();
const Shop = require("../model/Shop");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

router.post("/crate-shop", async (req, res) => {
	const reqShopName = req.body.shopName;
	const shopName = await Shop.findOne({ shopName: reqShopName });

	const shop = {
		shopName: req.body.shopName,
		email: req.body.email,
		zipCode: req.body.zipCode,
		phoneNumber: req.body.phoneNumber,
		address1: req.body.address1,
		address2: req.body.address2,
		password: req.body.password,
	};
	console.log(shop);

	if (shopName) {
		console.log("Shop already exists");
	}
	//const shopData = await Shop.create(req.body);

	const createActivationToken = (shop) => {
		return jwt.sign(shop, process.env.ACTIVATION_SECRET, {
			expiresIn: "5m",
		});
	};
	const activationToken = createActivationToken(shop);
	const activationUrl = `http://localhost:5173/api/v1/seller/activation?activation_token=${activationToken}`;

	console.log(activationUrl);
	await sendMail({
		email: shop.email,
		subject: "Activate you Seller Account account",
		message: `Click to activate ${activationUrl}`,
	});
	res.status(201).json({
		success: true,
		message: `please check your email`,
	});
});

router.post("/activation", async (req, res) => {
	try {
		const { activation_token } = req.body;
		console.log(activation_token);
		const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

		const {
			shopName,
			zipCode,
			email,
			phoneNumber,
			address1,
			address2,
			password,
		} = newUser;

		console.log(newUser);

		if (!newUser) return next("Invalid Token");

		const dataUser = await Shop.create({
			shopName,
			email,
			zipCode,
			phoneNumber,
			address1,
			address2,
			password,
		});

		sendToken(dataUser, 201, res);
		/* res.status(201).json({
			success: 200,
		}); */
	} catch (error) {
		console.log(error);
	}
});

router.post("/login-shop", async (req, res) => {
	let shop = await Shop.findOne(
		{ email: req.body.email },
		{ password: 1, email: 1, fullName: 1, role: 1 } // used projection because other password is not returend
	);

	console.log(req.body.password);
	console.log(shop);

	let isPasswordMatch;
	try {
		isPasswordMatch = await shop.comparePassword(req.body.password);
		console.log(isPasswordMatch);

		const gwtTok = shop.getJwtToken();
		console.log("gwtTok: " + gwtTok);

		sendToken(shop, 201, res);
		/* res.status(200).json({
			success: true,
			fullName: user.fullName,
			token: gwtTok,
		}); */
	} catch (error) {
		isPasswordMatch = false;
		console.log(error);
		res.status(500).json({
			success: false,
		});
	}
});

router.get("/get-shop-details/:id", async (req, res) => {
	console.log(req.params.id);
	const shopId = req.params.id;

	const shopDetails = await Shop.findOne({ _id: shopId });
	res.status(200).json({ data: shopDetails });
});

module.exports = router;
