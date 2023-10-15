const express = require("express");
const connectDatabase = require("./db/database");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const sessions = require("express-session");
const bodyParser = require("body-parser");
var cookies = require("cookie-parser");
app.use(cookies());

/* Controllers */
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

const userController = require("./controller/userController");
const productController = require("./controller/productController");
const sellerController = require("./controller/sellerController");
const cartController = require("./controller/cartController");
const wishListController = require("./controller/wishListController");
const orderController = require("./controller/orderController");
const googleAuth = require("./controller/googleAuth");
const errorHandling = require("./middleware/errorHandling");

/* Cors */
const cors = require("cors");
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, //access-control-allow-credentials:true
		optionSuccessStatus: 200,
	})
);

/* Session */
app.use(
	sessions({
		secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
		saveUninitialized: true,
		resave: false,
	})
);

/* Passport */
require("./utils/passport");
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;

app.use(
	express.json({
		limit: "50mb",
	})
);

app.use(bodyParser.urlencoded({ extended: true }));

// Static file
app.use("/images", express.static(__dirname + "/uploads"));

// Router
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/admin/", adminRoutes);

app.use("/api/v1/user/", userController);
app.use("/api/v1/seller/", sellerController);
app.use("/api/v1/cart/", cartController);
app.use("/api/v1/wish-list/", wishListController);
app.use("/api/v1/order/", orderController);
app.use("/auth/", googleAuth);

app.get("*", (req, res) => {
	console.log("no matching url");
});

/* Error handler */
app.use(errorHandling);

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
	connectDatabase();
});
