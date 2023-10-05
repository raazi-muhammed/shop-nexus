const express = require("express");
const app = express();
//require("dotenv").config();
require("dotenv").config({ path: "./config/.env" });

const PORT = process.env.PORT;

app.get("*", (req, res) => {
	console.log("HHIHI");
});

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
