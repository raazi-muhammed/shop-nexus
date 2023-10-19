import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserConversationsPage = () => {
	const userData = useSelector((state) => state.userData.userData);
	const [data, setData] = useState([null]);
	const { userId } = useParams();

	useEffect(() => {
		axios
			.get(`${server}/conversation/get-all-conversation/${userData._id}`)
			.then((res) => setData(res.data))
			.catch((err) => console.log(err));
	}, []);

	return (
		<div>
			{data.conversations?.map((e) => (
				<div className="d-flex bg-white rounded-4 my-3 p-2">
					<img
						className="rounded-circle"
						src={e.shop.image.url}
						alt=""
						style={{ width: "3rem" }}
					/>
					<p className="text-primary fw-bold my-auto ps-3">{e.shop.shopName}</p>
				</div>
			))}
			<p>{JSON.stringify(data)}</p>
		</div>
	);
};

export default UserConversationsPage;
