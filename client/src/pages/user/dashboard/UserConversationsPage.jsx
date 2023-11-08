import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChattingComp from "../../../components/ChattingComp";

const UserConversationsPage = () => {
	const userData = useSelector((state) => state.userData.userData);
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
		setToPersonInfo({
			name: receiver?.shopName,
			imageUrl: receiver?.image?.url,
		});
	};

	useEffect(() => {
		axios
			.get(`${server}/conversation/get-all-conversation/${userData._id}`)
			.then((res) => setData(res.data))
			.catch((err) => console.log(err));
	}, []);

	return (
		<section className="row">
			<div className="col">
				{data.conversations?.length === 0 && (
					<p className="text-secondary text-center mt-5 pt-5">No Messages</p>
				)}
				{data.conversations?.map((e, i) => (
					<div
						key={e.shop._id || i}
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
						onClick={() => handleStartMessage(e.shop, e.user)}
						className="bg-white rounded-4 my-3 p-2">
						<div className="d-flex">
							<img
								className="rounded-circle"
								src={e.shop?.image?.url}
								alt=""
								style={{ width: "3rem" }}
							/>
							<p className="text-primary fw-bold my-auto ps-3">
								{e.shop?.shopName}
							</p>
						</div>
					</div>
				))}
			</div>
			<ChattingComp chatInfo={chatInfo} toPersonInfo={toPersonInfo} />
		</section>
	);
};

export default UserConversationsPage;
