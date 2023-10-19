import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import server from "../server";
import { io } from "socket.io-client";

const ChattingComp = () => {
	const socket = useRef();

	const [message, setMessage] = useState();

	const handleSendMessage = (e) => {
		e.preventDefault();
		//axios.post(`${server}/chat/connect`, { message });
		socket.current.emit("send-message", message);
	};

	useEffect(() => {
		socket.current = io("http://localhost:8080");
		socket.current.on("receive-message", (message) => {
			console.log(message);
		});
	}, [socket]);

	return (
		<main className="w-100 position-relative " style={{ height: "30rem" }}>
			<section className="overflow-auto h-100">
				<div
					className="bg-light p-2 px-3 m-0 rounded-4"
					style={{ width: "fit-content" }}>
					<p className="m-0">Hi</p>
				</div>
				<div
					className="bg-secondary text-white p-2 px-3 ms-auto m-0 rounded-4"
					style={{ width: "fit-content" }}>
					<p className="m-0">Hi</p>
				</div>
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
						type="button"
						id="send-button">
						Send
					</button>
				</form>
			</section>
		</main>
	);
};

export default ChattingComp;
