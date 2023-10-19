import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import server from "../server";
import { useParams } from "react-router-dom";
//import { io } from "socket.io-client";

const ChattingComp = () => {
	//const socket = useRef(io("http://localhost:8080"));
	const { senderId, receiverId } = useParams("");
	const [messages, setMessages] = useState([]);
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
						setMessages(res.data.messages);
					});
			});
	}, []);

	const handleSendMessage = (e) => {
		e.preventDefault();

		axios
			.post(`${server}/message/new-message`, {
				conversationId: conversationID,
				sender: senderId,
				text: message,
			})
			.then((res) => console.log(res))
			.catch((err) => console.log(err));

		setMessage("");
		/* socket.current.emit("send-message", {
			conversationId: "65313c5cdfff6c90789e5b3b",
			sender: "652f63f1710105376460575b",
			message,
		}); */
	};

	/* 	useEffect(() => {
		socket.current.on("receive-message", (message) => {
			console.log(message);
		});
	}, [socket]); */

	return (
		<main className="w-100 position-relative p-5" style={{ height: "50rem" }}>
			<p>conversationID: {conversationID}</p>
			<p>Sender: {senderId}</p>
			<p>Receiver: {receiverId}</p>
			<section className="overflow-auto h-100">
				{messages?.map((msg) => (
					<div
						className={`p-2 px-3 m-1 my-2 rounded-4 ${
							senderId === msg.sender
								? "ms-auto bg-secondary text-white"
								: "me-auto bg-white text-primary"
						}`}
						style={{ width: "fit-content" }}>
						<p className="m-0">{msg.text}</p>
						<p className="m-0 text-small text-light">{msg.sender}</p>
					</div>
				))}
				<hr className="m-5 p-5" />
			</section>
			<section className="position-absolute w-100 bottom-0">
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
