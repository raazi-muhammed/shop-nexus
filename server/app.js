const express = require("express");
const connectDatabase = require("./db/database");
const app = express();
require("dotenv").config({ path: "./config/.env" });

const sessions = require("express-session");
const bodyParser = require("body-parser");

var cookies = require("cookie-parser");
app.use(cookies());

/* Controllers */
const userController = require("./controller/userController");
const productController = require("./controller/productController");
const sellerController = require("./controller/sellerController");
const adminController = require("./controller/adminController");

const ErrorHandler = require("./utils/errorHandler");

/* Cors */
const cors = require("cors");
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, //access-control-allow-credentials:true
		optionSuccessStatus: 200,
	})
);

const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file
app.use("/images", express.static(__dirname + "/uploads"));

/* Session */
app.use(
	sessions({
		secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
		saveUninitialized: true,
		resave: false,
	})
);

// Router
app.use("/api/v1/user/", userController);
app.use("/api/v1/products/", productController);
app.use("/api/v1/seller/", sellerController);
app.use("/api/v1/admin/", adminController);

app.get("*", (req, res) => {
	console.log("no matching url");
});

/* Error handler */
app.use(ErrorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
	connectDatabase();
});
