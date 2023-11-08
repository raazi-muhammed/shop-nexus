const User = require("../model/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { isEventValid } = require("./eventController");

// @METHOD GET
// @PATH /cart/get-all-cart
const getCart = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;

	const updatedUser = await User.findOne({ _id: userId }).populate(
		"cart.product"
	);

	updatedUser.cart.map(async (item, i) => {
		if (item.offer.applied) {
			if (item.offer.type === "EVENT") {
				const eventValid = await isEventValid(
					item.offer.details.id,
					updatedUser.cart
				);

				// if the event if invalid removing the offer felid from user
				if (!eventValid) {
					let cartItem = item;
					cartItem.offer = {};
					let updateObj = {};
					updateObj[`cart.${i}`] = cartItem;
					const newUser = await User.findOneAndUpdate(
						{ _id: userId },
						{
							$set: updateObj,
						},
						{ new: true }
					);
				}
			}
		}
	});

	res.status(200).json({
		success: true,
		message: "Added to Cart",
		user: updatedUser,
	});
});

// @METHOD POST
// @PATH /cart/add-to-cart
const addToCart = asyncErrorHandler(async (req, res, next) => {
	const { product_id, price, quantity, offer } = req.body;
	const userId = req.user._id;

	const cartItem = {
		product: product_id,
		quantity,
		price,
	};
	if (offer) {
		cartItem.offer = offer;
	}
	const currentUserState = await User.findOne({ _id: userId });

	// Checking if the items already in cart is changed and if then updating the values
	let isChanged = false;
	let updatedUser;
	currentUserState.cart.map(async (items, i) => {
		if (items.product == cartItem.product) {
			isChanged = true;

			let updateObj = {};
			updateObj[`cart.${i}`] = cartItem;
			updatedUser = await User.findOneAndUpdate(
				{ _id: userId },
				{
					$set: updateObj,
				},
				{ new: true }
			).populate("cart.product");
		}
	});

	if (!isChanged) {
		updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{
				$addToSet: { cart: cartItem },
			},
			{ new: true }
		).populate("cart.product");
	}

	res.status(200).json({
		success: true,
		message: "Added to Cart",
		user: updatedUser,
	});
});

// @METHOD PUT
// @PATH /cart/remove-from-cart
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

// @METHOD DELETE
// @PATH /cart/clear-all-cart-items
const clearAllCartItems = asyncErrorHandler(async (req, res, next) => {
	const userId = req.user._id;

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId },
		{ $set: { cart: [] } },
		{ new: true }
	).populate("cart.product");

	res.status(200).json({
		success: true,
		message: "Cart Cleared",
		user: updatedUser,
	});
});

module.exports = { getCart, addToCart, removeFromCart, clearAllCartItems };
