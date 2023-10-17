const Coupon = require("../model/Coupon");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

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

module.exports = { addCoupon, getCouponFromSeller };
