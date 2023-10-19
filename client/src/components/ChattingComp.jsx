import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import server from "../server";
import { useParams } from "react-router-dom";
import { socket } from "../socket";

const ChattingComp = () => {
	const { senderId, receiverId } = useParams("");
	//const [displayMessages, setDisplayMessages] = useState([]);
	const displayMessages = useRef([]);
	const [message, setMessage] = useState("");
	const [conversationID, setConversationID] = useState("");
	const [refresh, setRefresh] = useState(true);

	//creating the conversation if not available if conversatinis there getting the messages
	useEffect(() => {
		axios
			.post(`${server}/conversation/get-conversation`, {
				senderId: senderId,
				receiverId: receiverId,
			})
			.then((res) => {
				console.log(res.data);
				setConversationID(res.data.conversationId);
				axios
					.get(`${server}/message/get-messages/${res.data.conversationId}`)
					.then((res) => {
						console.log(res);
						displayMessages.current = res.data.messages;
					});
			});
	}, []);

	const handleSendMessage = (e) => {
		e.preventDefault();

		console.log(socket.id);

		axios
			.post(`${server}/message/new-message`, {
				conversationId: conversationID,
				sender: senderId,
				text: message,
			})
			.then((res) => console.log(res))
			.catch((err) => console.log(err));

		const oldMsg = displayMessages.current;
		displayMessages.current = [...oldMsg, { sender: senderId, text: message }];

		setMessage("");
		socket.emit("send-message", {
			conversationId: conversationID,
			senderId,
			receiverId,
			message,
		});
	};

	useEffect(() => {
		socket.emit("add-user", senderId);
	}, []);

	useEffect(() => {
		socket.on("receive-message", (res) => {
			console.log(res?.message);

			const oldMsg = displayMessages.current;
			displayMessages.current = [
				...oldMsg,
				{ sender: res.senderId, text: res.message },
			];
			setRefresh(!refresh);
		});
	}, [socket]);

	return (
		<main className="w-100 position-relative p-5" style={{ height: "50rem" }}>
			<p>conversationID: {conversationID}</p>
			<p>Sender: {senderId}</p>
			<p>Receiver: {receiverId}</p>

			<section className="overflow-auto h-75">
				{displayMessages?.current?.map((msg) => (
					<div
						className={`p-2 px-3  m-1 my-2 rounded-4 ${
							senderId === msg.sender
								? "ms-auto bg-secondary text-white"
								: receiverId === msg.sender
								? "me-auto bg-white text-primary"
								: "visually-hidden"
						}`}
						style={{ width: "fit-content" }}>
						<p className="m-0">{msg.text}</p>
						<p className="m-0 text-small text-light">{msg.sender}</p>
					</div>
				))}
			</section>
			<section className="w-100">
				<form onSubmit={handleSendMessage} class="input-group mb-3">
					<input
						type="text"
						class="form-control"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="message..."
						aria-label="chat-input"
						aria-describedby="button-addon2"
					/>
					<button
						class="btn btn-secondary text-white"
						type="submit"
						id="send-button">
						Send
					</button>
				</form>
			</section>
		</main>
	);
};

export default ChattingComp;
