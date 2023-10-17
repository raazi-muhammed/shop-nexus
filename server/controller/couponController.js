const Coupon = require("../model/Coupon");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const addCoupon = asyncErrorHandler(async (req, res, next) => {
	console.log(req.body);
	const couponDataForm = { ...req.body, events: [{ name: "Coupon Created" }] };

	const couponData = await Coupon.create(couponDataForm);

	res.status(200).json({
		success: true,
		message: "Coupon Added",
	});
});
const getCouponFromSeller = asyncErrorHandler(async (req, res, next) => {
	const { shopId } = req.params;

	const couponData = await Coupon.find({ shopId });
	res.status(200).json({
		success: true,
		message: "Got Coupon",
		couponData,
	});
});

const applyCouponCode = asyncErrorHandler(async (req, res, next) => {
	const { couponCode, totalAmount } = req.body;

	const couponData = await Coupon.find({ code: couponCode });

	if (couponData.length === 0)
		return next(new ErrorHandler("No coupon found", 400));

	if (couponData[0].status !== "Valid")
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

module.exports = { addCoupon, getCouponFromSeller, applyCouponCode };
