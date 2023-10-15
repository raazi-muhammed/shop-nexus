const User = require("../model/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getWishList = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;

	const updatedUser = await User.findOne({ _id: userId }).populate(
		"wishList.product"
	);

	res.status(200).json({
		success: true,
		user: updatedUser,
	});
});
const addToWishList = asyncErrorHandler(async (req, res, next) => {
	const { product_id, price, name, imageUrl } = req.body;
	const userId = req.user._id;

	const cartItem = {
		product: product_id,
		price,
	};

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId },
		{
			$addToSet: { wishList: cartItem },
		},
		{ new: true }
	).populate("wishList.product");

	console.log(updatedUser);

	res.status(200).json({
		success: true,
		message: "Added to Wishlist",
		user: updatedUser,
	});
});
const removeFromWishList = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;
	const { product_id } = req.body;

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId },
		{
			$pull: { wishList: { product: product_id } },
		},
		{ new: true }
	).populate("wishList.product");

	res.status(200).json({
		success: true,
		message: "Removed from WishList",
		user: updatedUser,
	});
});

module.exports = { getWishList, addToWishList, removeFromWishList };
