const errorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500; // Updated to use `statusCode`
	err.message = err.message || "Internal Server Error";

	res.status(err.statusCode).json({
		// Updated to use `statusCode`
		success: false,
		message: err.message,
	});
};
