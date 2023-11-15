const fs = require("fs");
const path = require("path");

const activateAccountMail = (name, link) => {
	const htmlPage = fs.readFileSync(
		path.join(__dirname, "/activateAccount.html"),
		"utf8"
	);
	let newPage = htmlPage.replace("$ACTIVATION_LINK$", link);
	newPage = newPage.replace("$USERNAME$", name);
	return newPage;
};

module.exports = {
	activateAccountMail,
};
