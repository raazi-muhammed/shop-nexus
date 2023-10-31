const Transaction = require("../model/Transaction");
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

const createTransaction = async (personId, amount, description) => {
	return await Transaction.create({
		personId,
		amount,
		description,
	});
};
module.exports = { createWalletForUser, createTransaction };
