import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import server from "../server";
import { socket } from "../socket";

const ChattingComp = ({ chatInfo, toPersonInfo }) => {
	const { senderId, receiverId } = chatInfo;

	//const [displayMessages, setDisplayMessages] = useState([]);
	const displayMessages = useRef([]);
	const [message, setMessage] = useState("");
	const [conversationID, setConversationID] = useState("");

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
	}, [chatInfo, toPersonInfo]);

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

		try {
			window.setInterval(function () {
				var elem = document.getElementById("messages-chat");
				elem.scrollTop = elem.scrollHeight;
			}, 5000);
		} catch (error) {}
	};

	useEffect(() => {
		socket.emit("add-user", senderId);
	}, [chatInfo]);

	useEffect(() => {
		socket.on("receive-message", (res) => {
			console.log(res?.message);
			const oldMsg = displayMessages.current;
			displayMessages.current = [
				...oldMsg,
				{ sender: res.senderId, text: res.message },
			];
		});

		try {
			window.setInterval(function () {
				var elem = document.getElementById("messages-chat");
				elem.scrollTop = elem.scrollHeight;
			}, 5000);
		} catch (error) {}
	}, [socket]);

	return (
		<main className="w-100" style={{ height: "45rem" }}>
			<div className="d-flex align-content-center">
				<div>
					<img
						className="rounded-circle"
						src={toPersonInfo?.imageUrl}
						alt=""
						style={{ width: "2rem" }}
					/>
				</div>
				<p className="m-0 fw-bold text-secondary ms-2 mt-1  ">
					{toPersonInfo?.name}
				</p>
			</div>
			<div className="d-flex flex-wrap">
				<p className="text-small text-secondary m-0">
					conversationID: {conversationID} ||
				</p>
				<p className="text-small text-secondary m-0">Sender: {senderId} || </p>
				<p className="text-small text-secondary m-0">
					Receiver: {receiverId} ||{" "}
				</p>
			</div>

			<section id="messages-chat" className="overflow-auto h-75">
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
						class="form-control rounded-start-pill"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="message..."
						aria-label="chat-input"
						aria-describedby="button-addon2"
					/>
					<button
						class="btn px-3 btn-secondary text-white rounded-end-pill"
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
