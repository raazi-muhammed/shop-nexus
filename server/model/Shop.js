const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema(
	{
		shopName: {
			type: String,
			required: [true, "Please enter your shop name!"],
		},
		email: {
			type: String,
			required: [true, "Please enter your shop email address"],
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
			minLength: [6, "Password should be greater than 6 characters"],
		},
		description: {
			type: String,
		},
		address1: {
			type: String,
			required: true,
		},
		address2: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: Number,
			required: true,
		},
		GSTIN_Number: {
			type: String,
		},
		role: {
			type: String,
			default: "Seller",
		},
		image: {
			public_id: {
				type: String,
				//required: true,
			},
			url: {
				type: String,
				//required: true,
			},
		},
		zipCode: {
			type: Number,
			required: true,
		},
		withdrawMethod: {
			type: Object,
		},
		availableBalance: {
			type: Number,
			default: 0,
		},
		transactions: [
			{
				amount: {
					type: Number,
					required: true,
				},
				status: {
					type: String,
					default: "Processing",
				},
				createdAt: {
					type: Date,
					default: Date.now(),
				},
				updatedAt: {
					type: Date,
				},
			},
		],
		isBlocked: {
			type: Boolean,
			default: false,
		},
		wallet: {
			balance: {
				type: Number,
				default: 0,
			},
		},
	},
	{ timestamps: true }
);

// Hash password
shopSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);
