const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

// @METHOD POST
// @PATH /user/add-review
const addReview = asyncErrorHandler(async (req, res, next) => {
	const { rating, review, product } = req.body;
	const userId = req.user.id;

	const alreadyReviewPosted = await Review.findOne({
		"user.id": userId,
		product,
	});

	if (alreadyReviewPosted) {
		return next(new ErrorHandler("Review Already Posted", 500));
	}

	const newReview = await Review.create({
		rating,
		review,
		user: {
			name: req.user.fullName,
			avatar: req.user.avatar.url,
			id: userId,
		},
		product,
	});

	const updatedProduct = await Products.findOneAndUpdate(
		{ _id: product },
		{
			$addToSet: {
				reviews: { review: newReview._id },
			},
		},
		{ new: true }
	).populate("reviews.review");

	res.status(200).json({
		success: true,
		reviews: updatedProduct.reviews,
	});
});

// @METHOD GET
// @PATH /product/get-reviews/:productId
const getReviewFromProduct = asyncErrorHandler(async (req, res, next) => {
	const productId = req.params.productId;
	console.log(productId);

	const productReviews = await Products.findOne({ _id: productId }).populate(
		"reviews.review"
	);

	const reviews = productReviews.reviews;
	console.log(reviews);

	res.status(200).json({
		success: true,
		reviews,
	});
});

module.exports = {
	addReview,
	getReviewFromProduct,
};
