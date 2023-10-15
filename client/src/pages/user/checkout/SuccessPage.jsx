import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import server from "../../../server";

const SuccessPage = () => {
	const orderState = useSelector((state) => state.order);

	useEffect(() => {
		console.log(orderState);

		axios
			.post(
				`${server}/order/add-to-order`,
				{ orderState },
				{ withCredentials: true }
			)
			.then((res) => {
				console.log("hloo");
			});
	}, []);
	return (
		<div>
			<p>Payment Successful</p>
			<Link to={"/"}>Go Home</Link>
		</div>
	);
};

export default SuccessPage;
