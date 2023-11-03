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

	socket.on("add-user", (userId) => {
		addUser(userId, socket.id);
	});

	socket.on("send-message", ({ senderId, receiverId, message }) => {
		try {
			const receiver = getUser(receiverId);

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
		removeUser(socket.id);
	});
};

module.exports = sockets;
