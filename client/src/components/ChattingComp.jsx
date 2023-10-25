import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import server from "../server";
import { socket } from "../socket";

const ChattingComp = ({ chatInfo, toPersonInfo }) => {
	const { senderId, receiverId } = chatInfo;

	const [messagesToShow, setMessagesToShow] = useState([]);
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
						setMessagesToShow(res.data.messages);
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

		setMessagesToShow([...messagesToShow, { sender: senderId, text: message }]);

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
	}, [chatInfo]);

	useEffect(() => {
		socket.on("receive-message", (res) => {
			console.log(res?.message);

			setMessagesToShow((prevMessagesToShow) => [
				...prevMessagesToShow,
				{ sender: res.senderId, text: res.message },
			]);
		});
	}, [socket]);

	useEffect(() => {
		const divRef = document.querySelector("#messages-chat");
		divRef.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, [messagesToShow]);

	return (
		<main className="w-100" style={{ height: "85vh" }}>
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
			<section className="overflow-auto h-75">
				{messagesToShow?.map((msg) => (
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
				<hr className="text-light" id="messages-chat" />
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
