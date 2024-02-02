const router = require("express").Router();
const { isUserAuthenticated } = require("../middleware/auth");
const {
    addToCart,
    getCart,
    removeFromCart,
    clearAllCartItems,
} = require("../controller/cartController");

router.post("/add-to-cart", isUserAuthenticated, async (req, res, next) => {
    addToCart(req, res, next);
});
router.get("/get-all-cart", isUserAuthenticated, (req, res, next) =>
    getCart(req, res, next)
);
router.put("/remove-from-cart", isUserAuthenticated, (req, res, next) => {
    removeFromCart(req, res, next);
});

router.delete(
    "/clear-all-cart-items",
    isUserAuthenticated,
    (req, res, next) => {
        clearAllCartItems(req, res, next);
    }
);

module.exports = router;
