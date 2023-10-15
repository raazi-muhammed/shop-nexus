const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const {
	getWishList,
	addToWishList,
	removeFromWishList,
} = require("../controller/wishListController");

router.post("/add-to-wish-list", isAuthenticated, (req, res, next) => {
	addToWishList(req, res, next);
});
router.get("/get-all-wish-list", isAuthenticated, (req, res, next) => {
	getWishList(req, res, next);
});
router.put("/remove-from-wish-list", isAuthenticated, (req, res, next) => {
	removeFromWishList(req, res, next);
});
module.exports = router;
