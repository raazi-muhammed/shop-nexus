const mongoose = require("mongoose");
const connectDatabase = () => {
	mongoose
		.connect(process.env.DB_URL, {
			useNewURLParser: true,
			useUnifiedTopology: true,
		})
		.then((data) => {
			console.info("MongoDB Connected");
		})
		.catch((err) => console.error(err));
};

module.exports = connectDatabase;
