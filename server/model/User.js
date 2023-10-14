const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: [true, "Please enter your name!"],
	},
	email: {
		type: String,
		required: [true, "Please enter your email!"],
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		minLength: [4, "Password should be greater than 4 characters"],
		select: false,
	},
	phoneNumber: {
		type: Number,
	},
	addresses: [
		{
			fullName: {
				type: String,
				required: true,
			},
			phoneNumber: {
				type: Number,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			state: {
				type: String,
				required: true,
			},
			address1: {
				type: String,
				required: true,
			},
			address2: {
				type: String,
				required: true,
			},
			pinCode: {
				type: Number,
				required: true,
			},
			addressType: {
				type: String,
				default: "Home",
			},
		},
	],
	role: {
		type: String,
		default: "user",
	},
	avatar: {
		url: {
			type: String,
			//required: true,
		},
	},
	cart: [
		{
			_id: false,
			product_id: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			imageUrl: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
			price: {
				type: Number,
				required: true,
			},
		},
	],
	wishList: [
		{
			_id: false,
			product_id: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			imageUrl: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
		},
	],

	createdAt: {
		type: Date,
		default: Date.now(),
	},
	isBlocked: {
		type: Boolean,
		default: false,
	},
	resetPasswordToken: String,
	resetPasswordTime: Date,
});

//  Hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
