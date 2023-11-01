const express = require("express");
const connectDatabase = require("./db/database");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const sessions = require("express-session");
const bodyParser = require("body-parser");
const cookies = require("cookie-parser");
app.use(cookies());
const PORT = process.env.PORT;

/* Socket */
const { createServer } = require("http");
const { Server, socket } = require("socket.io");
const http = createServer(app);
const io = new Server(http, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});
const sockets = require("./socket/sockets");

/* Routes */
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishListRoutes = require("./routes/wishListRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const errorHandling = require("./middleware/errorHandling");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const eventRoutes = require("./routes/eventRoutes");

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
app.use("/api/v1/cart/", cartRoutes);
app.use("/api/v1/wish-list/", wishListRoutes);
app.use("/api/v1/order/", orderRoutes);
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/seller/", sellerRoutes);
app.use("/api/v1/message/", messageRoutes);
app.use("/api/v1/conversation/", conversationRoutes);
app.use("/api/v1/payment/", paymentRoutes);
app.use("/api/v1/event/", eventRoutes);

app.get("*", (req, res) => {
	console.log("NOT FOUND");
});

/* Error handler */
app.use(errorHandling);

io.on("connection", (socket) => {
	sockets(socket, io);
});

http.listen(PORT, () => {
	console.log(`SERVER STARTED ON ${PORT}`);
	connectDatabase();
});
