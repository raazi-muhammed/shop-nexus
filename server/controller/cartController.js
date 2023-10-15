const { isAuthenticated } = require("../middleware/auth");
const User = require("../model/User");

const router = require("express").Router();

router.post("/add-to-cart", isAuthenticated, async (req, res) => {
	try {
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
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.get("/get-all-cart", isAuthenticated, async (req, res) => {
	try {
		const userId = req.user._id;

		const updatedUser = await User.findOne({ _id: userId }).populate(
			"cart.product"
		);

		res.status(200).json({
			success: true,
			message: "Added to Cart",
			user: updatedUser,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.put("/remove-from-cart", isAuthenticated, async (req, res) => {
	try {
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
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

module.exports = router;
