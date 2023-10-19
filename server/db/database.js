const mongoose = require("mongoose");

const connectDatabase = () => {
	mongoose
		.connect(process.env.DB_URL, {
			useNewURLParser: true,
			useUnifiedTopology: true,
		})
		.then((data) => {
			console.log("MongoDB Connected");
		})
		.catch((err) => console.log(err));
};

module.exports = connectDatabase;
