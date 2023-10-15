const User = require("../model/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getCart = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;

	const updatedUser = await User.findOne({ _id: userId }).populate(
		"cart.product"
	);

	res.status(200).json({
		success: true,
		message: "Added to Cart",
		user: updatedUser,
	});
});

const addToCart = asyncErrorHandler(async (req, res, next) => {
	const { product_id, price, name, imageUrl } = req.body;
	const userId = req.user._id;

	const cartItem = {
		product: product_id,
		price,
	};

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId },
		{
			$addToSet: { cart: cartItem },
		},
		{ new: true }
	).populate("cart.product");

	res.status(200).json({
		success: true,
		message: "Added to Cart",
		user: updatedUser,
	});
});

const removeFromCart = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;
	const { product_id } = req.body;

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId },
		{
			$pull: { cart: { product: product_id } },
		},
		{ new: true }
	).populate("cart.product");

	res.status(200).json({
		success: true,
		message: "Removed from Cart",
		user: updatedUser,
	});
});

module.exports = { getCart, addToCart, removeFromCart };
