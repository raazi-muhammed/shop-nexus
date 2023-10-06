const express = require("express");
const connectDatabase = require("./db/database");
const app = express();
//require("dotenv").config();
require("dotenv").config({ path: "./config/.env" });
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
//const fileUpload = require("express-fileupload");
const userController = require("./controller/userController");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(fileUpload({ useTempFiles: true }));

// Static file
app.use("/", express.static("uploads"));

app.get("*", (req, res) => {
	console.log("HHIHI");
});

// Router
app.use("/api/v1/user", userController);

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
	connectDatabase();
});
