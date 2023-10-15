const {
	adminLogOut,
	adminLogIn,
	getAllUsers,
	adminBlockAndUnBlockUser,
} = require("../controller/adminController");

const express = require("express");
router = express.Router();
const { isAdminAuthenticated } = require("../middleware/adminAuth");

router.get("/logout", (req, res) => adminLogOut(req, res));
router.post("/login", async (req, res, next) => adminLogIn(req, res, next));
router.get("/get-all-users", isAdminAuthenticated, (req, res, next) => {
	getAllUsers(req, res, next);
});
router.post("/block-user", isAdminAuthenticated, (req, res) => {
	adminBlockAndUnBlockUser(req, res);
});

module.exports = router;
