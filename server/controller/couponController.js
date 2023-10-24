const Coupon = require("../model/Coupon");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const addCoupon = asyncErrorHandler(async (req, res, next) => {
	console.log(req.body);
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
	const { shopId } = req.params;
	const ITEMS_PER_PAGE = 10;
	const { page } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const countPromise = Coupon.estimatedDocumentCount({});

	const couponDataPromise = Coupon.find({ shopId })
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
		pagination: {
			count,
			page,
			pageCount,
			startIndex,
		},
		message: "Got Coupon",
		couponData,
	});
});

const applyCouponCode = asyncErrorHandler(async (req, res, next) => {
	const { couponCode, totalAmount } = req.body;

	const couponData = await Coupon.find({ code: couponCode });

	if (couponData.length === 0)
		return next(new ErrorHandler("No coupon found", 400));

	if (couponData[0].status !== "Active")
		return next(new ErrorHandler("Coupon not Valid", 400));

	if (couponData[0].minAmount >= totalAmount)
		return next(new ErrorHandler("Minimum amount not reached", 400));

	if (couponData[0].maxAmount <= totalAmount)
		return next(new ErrorHandler("Maximum amount reached", 400));

	const date = new Date();
	const couponDate = new Date(couponData[0].expires);
	if (date > couponDate) return next(new ErrorHandler("Coupon expired", 400));

	const discountAmount = totalAmount * couponData[0].discountPercentage;

	res.status(200).json({
		success: true,
		message: `Coupon Code Applied`,
		discountAmount: discountAmount,
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
	} = req.body;

	const couponAlready = await Coupon.find({ code });
	/* if (couponAlready.length !== 0)
		return next(new ErrorHandler("Coupon code taken", 400)); */

	const couponData = await Coupon.findOneAndUpdate(
		{ _id: couponId },
		{ code, name, status, minAmount, maxAmount, discountPercentage, expires },
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Coupon Updated",
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
};
