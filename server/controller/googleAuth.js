const router = require("express").Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
	"google/callback",
	passport.authenticate("google", {
		successRedirect: "http://localhost:5173",
		failureRedirect: "login/failed",
	})
);

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			success: false,
			message: "Successful",
			user: req.user,
			//cookies:
		});
	}
	res.status(400).json({
		success: false,
		message: "failed",
	});
});

router.get("/login/failed", (req, res) => {
	res.status(400).json({
		success: false,
		message: "failed",
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	//req.redire
	console.log("logged out");
});

module.exports = router;
