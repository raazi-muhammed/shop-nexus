import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import { useParams } from "react-router-dom";
import ChattingComp from "../../../components/ChattingComp";

const SellerConversationsPage = () => {
	let { shopId } = useParams();

	const [data, setData] = useState([null]);
	const [toPersonInfo, setToPersonInfo] = useState({});
	const [chatInfo, setChatInfo] = useState({
		senderId: "",
		receiverId: "",
	});

	const handleStartMessage = (receiver, sender) => {
		setChatInfo({
			senderId: sender._id,
			receiverId: receiver._id,
		});

		console.log(chatInfo);
		setToPersonInfo({
			name: receiver?.fullName,
			imageUrl: receiver?.avatar?.url,
		});
	};

	useEffect(() => {
		axios
			.get(`${server}/conversation/get-all-conversation/${shopId}`)
			.then((res) => setData(res.data))
			.catch((err) => console.log(err));
	}, []);

	return (
		<section className="row">
			<div className="col-3">
				{data.conversations?.length === 0 && (
					<p className="text-secondary text-center mt-5 pt-5">No Messages</p>
				)}
				{data.conversations?.map((e) => (
					<div
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
						onClick={() => handleStartMessage(e.user, e.shop)}
						className="bg-white rounded-4 my-3 p-2">
						<div className="d-flex">
							<img
								className="rounded-circle"
								src={e.user?.avatar?.url}
								alt=""
								style={{ width: "3rem" }}
							/>
							<p className="text-primary fw-bold my-auto ps-3">
								{e.user?.fullName}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="col-8">
				{chatInfo?.senderId == "" ? (
					<p className="text-secondary text-center mt-5 pt-5">
						Please select a conversation
					</p>
				) : (
					<ChattingComp chatInfo={chatInfo} toPersonInfo={toPersonInfo} />
				)}
			</div>
		</section>
	);
};

export default SellerConversationsPage;
