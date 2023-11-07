const router = require("express").Router();
const { isUserAuthenticated } = require("../middleware/auth");
const {
	getWishList,
	addToWishList,
	removeFromWishList,
} = require("../controller/wishListController");

router.post("/add-to-wish-list", isUserAuthenticated, (req, res, next) => {
	addToWishList(req, res, next);
});
router.get("/get-all-wish-list", isUserAuthenticated, (req, res, next) => {
	getWishList(req, res, next);
});
router.put("/remove-from-wish-list", isUserAuthenticated, (req, res, next) => {
	removeFromWishList(req, res, next);
});
module.exports = router;
