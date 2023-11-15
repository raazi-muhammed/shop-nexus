const Shop = require("../model/Shop");
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

const changerUserWalletBalanceWithTransaction = async (
	userId,
	price,
	description
) => {
	await User.findOneAndUpdate(
		{ _id: userId },
		{
			$inc: { "wallet.balance": price },
		}
	);
	await createTransaction(userId, price, description);
};

const changerSellerWalletBalanceWithTransaction = async (
	sellerId,
	price,
	description
) => {
	await Shop.findOneAndUpdate(
		{ _id: sellerId },
		{
			$inc: { "wallet.balance": price },
		}
	);
	await createTransaction(sellerId, price, description);
};

module.exports = {
	createWalletForUser,
	createTransaction,
	changerUserWalletBalanceWithTransaction,
	changerSellerWalletBalanceWithTransaction,
};
