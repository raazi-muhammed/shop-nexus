const User = require("../model/User");

const createWalletForUser = async (userId) => {
	const user = await User.findOneAndUpdate(
		{ _id: userId },
		{
			wallet: { balance: 0 },
		},
		{ new: true }
	);
	return user;
};

module.exports = { createWalletForUser };
