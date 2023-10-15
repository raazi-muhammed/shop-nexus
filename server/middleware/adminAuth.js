const asyncErrorHandler = require("../utils/asyncErrorHandler");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");

exports.isAdminAuthenticated = asyncErrorHandler(async (req, res, next) => {
	const { userName, password } = req.cookies["adminDetails"];

	if (userName !== process.env.ADMIN_USERNAME) {
		return next(new ErrorHandler("Authentication Failed", 403));
	}

	if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
		return next(new ErrorHandler("Authentication Failed", 403));
	}
	next();
});
