let users = [];

const addUser = (userId, socketId) => {
	users.map((user) =>
		user.userId === userId ? (user.socketId = socketId) : null
	);

	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (userId, socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId == userId);

const sockets = (socket, io) => {
	socket.removeAllListeners();
	console.log(socket.id, "connected");

	socket.on("add-user", (userId) => {
		console.log(userId, socket.id);
		addUser(userId, socket.id);
		console.log(users);
	});

	socket.on("send-message", ({ senderId, receiverId, message }) => {
		try {
			const receiver = getUser(receiverId);
			console.log(receiver, "receiver");

			io.to(receiver.socketId).emit("receive-message", {
				senderId,
				receiver,
				message,
			});
		} catch (err) {
			console.log(err);
		}
	});

	socket.on("disconnect", () => {
		console.log(socket.id, "removed");
		removeUser(socket.id);
	});
};

module.exports = sockets;
