const Coupon = require("../model/Coupon");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");

const addCoupon = asyncErrorHandler(async (req, res, next) => {
	const couponDataForm = { ...req.body, events: [{ name: "Coupon Created" }] };

	const couponAlready = await Coupon.find({ code: couponDataForm.code });
	if (couponAlready.length !== 0)
		return next(new ErrorHandler("Coupon code taken", 400));

	const couponData = await Coupon.create(couponDataForm);

	res.status(200).json({
		success: true,
		message: "Coupon Added",
	});
});

const getAllCoupons = asyncErrorHandler(async (req, res, next) => {
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Coupon.estimatedDocumentCount({});

	const couponDataPromise = Coupon.find({})
		.sort({ createdAt: -1 })
		.limit(ITEMS_PER_PAGE)
		.skip(skip);

	const [couponData, count] = await Promise.all([
		couponDataPromise,
		countPromise,
	]);

	const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
	const startIndex = ITEMS_PER_PAGE * page - ITEMS_PER_PAGE;

	res.status(200).json({
		success: true,
		message: "Got Coupon",
		pagination: {
			count,
			page,
			pageCount,
			startIndex,
		},
		couponData,
	});
});

const getCouponFromSeller = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.shop._id;

	const [pagination, couponData] = await findWithPaginationAndSorting(
		req,
		Coupon,
		{ shopId }
	);

	res.status(200).json({
		success: true,
		pagination,
		message: "Got Coupon",
		couponData,
	});
});

const getApplicableCoupons = asyncErrorHandler(async (req, res, next) => {
	const { totalAmount } = req.query;

	const couponData = await Coupon.find({
		status: "ACTIVE",
		minAmount: { $lt: totalAmount },
		maxAmount: { $gt: totalAmount },
	})
		.sort({ createdAt: -1 })
		.limit(10);

	if (couponData.length === 0)
		return next(new ErrorHandler("No coupon found", 400));

	const date = new Date();
	const filteredCoupons = couponData.filter((_coupon) => {
		const couponDate = new Date(_coupon.expires);
		return date < couponDate;
	});

	res.status(200).json({
		success: true,
		message: "Got Coupon",
		couponData: filteredCoupons,
	});
});

const applyCouponCode = asyncErrorHandler(async (req, res, next) => {
	const { couponCode, totalAmount, products } = req.body;

	const couponData = await Coupon.findOne({ code: couponCode });

	if (!couponData) return next(new ErrorHandler("No coupon found", 400));

	if (couponData.status !== "ACTIVE")
		return next(new ErrorHandler("Coupon not Valid", 400));

	if (couponData.minAmount >= totalAmount)
		return next(new ErrorHandler("Minimum amount not reached", 400));

	if (couponData.maxAmount <= totalAmount)
		return next(new ErrorHandler("Maximum amount reached", 400));

	const date = new Date();
	const couponDate = new Date(couponData.expires);
	if (date > couponDate) return next(new ErrorHandler("Coupon expired", 400));

	switch (couponData.type) {
		case "CATEGORY_BASED_ALL":
			products.map((product) => {
				if (couponData.category != product.product.category)
					return next(
						new ErrorHandler(`All products must be in the Category`, 400)
					);
			});
			break;

		case "SHOP_BASED":
			products.map((product) => {
				if (couponData.shopId != product.product.shop.id)
					return next(
						new ErrorHandler(`All products must be from the same Shop`, 400)
					);
			});
			break;

		case "CATEGORY_BASED_SHOP":
			products.map((product) => {
				if (
					couponData.category != product.product.category ||
					couponData.shopId != product.product.shop.id
				)
					return next(
						new ErrorHandler(
							`All products must be in the Category and from same Shop`,
							400
						)
					);
			});
			break;

		default:
			break;
	}

	const discountPercentage = couponData.discountPercentage;

	res.status(200).json({
		success: true,
		message: `Coupon Code Applied`,
		discountPercentage,
		//couponData,
	});
});
const editCoupon = asyncErrorHandler(async (req, res, next) => {
	const {
		couponId,
		name,
		code,
		status,
		discountPercentage,
		expires,
		minAmount,
		maxAmount,
		category,
	} = req.body;

	const couponAlready = await Coupon.find({ code });
	/* if (couponAlready.length !== 0)
		return next(new ErrorHandler("Coupon code taken", 400)); */

	const couponData = await Coupon.findOneAndUpdate(
		{ _id: couponId },
		{
			code,
			name,
			status,
			minAmount,
			maxAmount,
			discountPercentage,
			expires,
			category,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Coupon Updated",
		couponData,
	});
});

const changeCouponState = asyncErrorHandler(async (req, res, next) => {
	const { couponId, status } = req.body;

	const couponData = await Coupon.findOneAndUpdate(
		{ _id: couponId },
		{
			status,
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Coupon Approved",
		couponData,
	});
});

const getCouponDetails = asyncErrorHandler(async (req, res, next) => {
	const { couponId } = req.params;
	const couponData = await Coupon.findOne({ _id: couponId });

	res.status(200).json({
		success: true,
		message: "Got Coupon",
		couponData,
	});
});

module.exports = {
	addCoupon,
	getCouponFromSeller,
	applyCouponCode,
	getCouponDetails,
	editCoupon,
	getAllCoupons,
	changeCouponState,
	getApplicableCoupons,
};
