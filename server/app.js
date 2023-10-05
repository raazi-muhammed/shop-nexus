const express = require("express");
const connectDatabase = require("./db/database");
const app = express();
//require("dotenv").config();
require("dotenv").config({ path: "./config/.env" });
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

app.get("*", (req, res) => {
	console.log("HHIHI");
});

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
	connectDatabase();
});
