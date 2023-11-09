const User = require("../model/User");
const {
	changerUserWalletBalanceWithTransaction,
} = require("./transactionController");

const SINGLE_REFERRAL_PRICE = 150;
const userCreatedViaReferral = async (referralCode) => {
	const user = await User.findOneAndUpdate(
		{
			"referral.myCode": referralCode,
		},
		{
			$inc: {
				"referral.myReferrals.count": 1,
				"referral.myReferrals.moneyViaReferral": SINGLE_REFERRAL_PRICE,
			},
		}
	);

	await changerUserWalletBalanceWithTransaction(
		user._id,
		SINGLE_REFERRAL_PRICE,
		`For Referral`
	);
};

const firstOrderReferral = async (orderUser) => {
	try {
		if (
			orderUser.referral.viaReferral &&
			!orderUser.referral.viaReferralDetails.boughtFirstItem
		) {
			const referralCode = orderUser.referral.viaReferralDetails.code;

			const user = await User.findOneAndUpdate(
				{
					"referral.myCode": referralCode,
				},
				{
					$inc: {
						"referral.myReferrals.moneyViaReferral": SINGLE_REFERRAL_PRICE,
					},
				}
			);

			await changerUserWalletBalanceWithTransaction(
				user._id,
				SINGLE_REFERRAL_PRICE,
				`For Referral's First Order`
			);

			// sets the boughtFirstItem to true
			await User.findOneAndUpdate(
				{
					_id: orderUser._id,
				},
				{
					"referral.viaReferralDetails.boughtFirstItem": true,
				}
			);
		}
	} catch (err) {
		console.log(err.message);
	}
};

module.exports = { userCreatedViaReferral, firstOrderReferral };
