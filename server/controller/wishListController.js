const { isAuthenticated } = require("../middleware/auth");
const User = require("../model/User");

const router = require("express").Router();

router.post("/add-to-wish-list", isAuthenticated, async (req, res) => {
	try {
		const { product_id, price, name, imageUrl } = req.body;
		const userId = req.user._id;

		const cartItem = {
			product_id,
			price,
			name,
			imageUrl,
		};

		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{
				$addToSet: { wishList: cartItem },
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Added to Wishlist",
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

router.get("/get-all-wish-list", isAuthenticated, async (req, res) => {
	try {
		const userId = req.user._id;

		const updatedUser = await User.findOne({ _id: userId });
		const wishListItems = updatedUser.wishList;

		res.status(200).json({
			success: true,
			wishListItems,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
});

router.put("/remove-from-wish-list", isAuthenticated, async (req, res) => {
	try {
		const userId = req.user._id;
		const { product_id } = req.body;

		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{
				$pull: { wishList: { product_id } },
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Removed from WishList",
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
