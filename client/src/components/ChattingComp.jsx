import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../server";
import { socket } from "../socket";
import convertISOToDate from "../utils/convertISOToDate";

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
	}, [senderId, receiverId, toPersonInfo]);

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
		return () => socket.off("send-message");
	};

	useEffect(() => {
		socket.emit("add-user", senderId);
	}, [senderId, receiverId]);

	useEffect(() => {
		socket.on("receive-message", (res) => {
			console.log(res?.message);

			setMessagesToShow((prevMessagesToShow) => [
				...prevMessagesToShow,
				{ sender: res.senderId, text: res.message },
			]);
		});
		return () => socket.off("receive-message");
	}, []);
	//}, [socket]);

	useEffect(() => {
		const divRef = document.querySelector("#messages-chat");
		divRef.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, [messagesToShow]);

	return (
		<main className="w-100">
			<div
				class="modal fade"
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div class="modal-dialog modal-xl modal-dialog-scrollable">
					<div class="modal-content">
						<div class="modal-header p-3 px-4 border-0 ">
							<div className="d-flex align-content-center">
								<div>
									<img
										className="rounded-circle"
										src={toPersonInfo?.imageUrl}
										alt=""
										style={{ width: "2.5rem" }}
									/>
								</div>
								<p className="m-0 fw-bold text-secondary ms-2 my-auto">
									{toPersonInfo?.name}
								</p>
							</div>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div class="modal-body vh-100">
							<section className="overflow-auto">
								{messagesToShow?.map((msg) => (
									<div
										className={`p-2 px-3   m-1 my-2 rounded-4 ${
											senderId === msg.sender
												? "ms-auto bg-secondary text-white"
												: receiverId === msg.sender
												? "me-auto bg-secondary-subtle text-primary"
												: "visually-hidden"
										}`}
										style={{ width: "fit-content" }}>
										<p className="m-0">{msg.text}</p>
										<p className="m-0 text-small opacity-50">
											{msg.createdAt
												? convertISOToDate(msg.createdAt, true)
												: "Now"}
										</p>
									</div>
								))}
								<hr className="text-light" id="messages-chat" />
							</section>
						</div>
						<div class="modal-footer p-1 bg-light">
							<section className="w-100">
								<form onSubmit={handleSendMessage} class="input-group">
									<input
										type="text"
										class="form-control rounded-pill"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="message..."
										aria-label="chat-input"
										aria-describedby="button-addon2"
									/>
									<button
										class="btn px-4 btn-secondary text-white rounded-pill ms-2"
										type="submit"
										id="send-button">
										Send
									</button>
								</form>
							</section>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ChattingComp;
