const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const bcrypt = require("bcrypt");

exports.isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
	try {
		const { userName, password } = req.cookies["adminDetails"];

		if (userName !== process.env.ADMIN_USERNAME) {
			res.status(403).json({
				success: false,
				message: "Authentication Failed",
			});
			return;
		}

		if (!(await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
			res.status(403).json({
				success: false,
				message: "Authentication Failed",
			});
			return;
		}
	} catch (err) {
		res.status(500).json({ success: false, message: "Authentication Failed" });
		return;
	}
	next();
});
