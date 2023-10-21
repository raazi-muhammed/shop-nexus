const Shop = require("../model/Shop");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const Products = require("../model/Products");
const { upload } = require("../multer");
const { isSellerAuthenticated } = require("../middleware/sellerAuth");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const sellerLogin = asyncErrorHandler(async (req, res, next) => {
	let shop = await Shop.findOne(
		{ email: req.body.email },
		{ password: 1, email: 1, fullName: 1, role: 1 } // used projection because other password is not returend
	);

	if (!shop) {
		res.status(404).json({
			success: false,
			errorWith: "email",
			message: "No user found",
		});
		return;
	}

	let isPasswordMatch = await shop.comparePassword(req.body.password);
	if (!isPasswordMatch) {
		res.status(404).json({
			success: false,
			errorWith: "password",
			message: "Incorrect Password",
		});
		return;
	}
	sendToken(shop, 201, res, "sellerToken");
});

const sellerCreateShop = asyncErrorHandler(async (req, res, next) => {
	const shopAlreadyExists = await Shop.findOne({
		$or: [{ shopName: req.body.shopName }, { email: req.body.email }],
	});

	if (shopAlreadyExists) {
		res.status(400).json({
			success: 400,
			errorWith: "email",
			message: "Email taken",
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
});

const sellerActivateShop = asyncErrorHandler(async (req, res, next) => {
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
});

const getShopDetails = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.params.id;

	const shopDetails = await Shop.findOne({ _id: shopId });
	res.status(200).json({
		success: true,
		data: shopDetails,
	});
});

const editShopDetails = asyncErrorHandler(async (req, res, next) => {
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
});

const sellerLogOut = asyncErrorHandler(async (req, res, next) => {
	res.status(200).clearCookie("sellerToken").json({
		success: true,
		message: "User is Logged out",
	});
});

module.exports = {
	sellerLogin,
	sellerCreateShop,
	sellerActivateShop,
	getShopDetails,
	editShopDetails,
	sellerLogOut,
};
