//createing toek nand saving in cookies

const sendToken = (user, statusCode, res) => {
	const token = user.getJwtToken();
	const options = {
		expires: newDate(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		user,
		token,
	});
};

module.exports = sendToken;
