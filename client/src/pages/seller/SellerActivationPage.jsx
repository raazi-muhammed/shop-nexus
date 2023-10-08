import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import server from "../../server";

const SellerActivationPage = () => {
	//const { activation_token } = useQuery();
	const [message, setMessage] = useState("Seller Verification on process");
	const [searchParams, setSearchParams] = useSearchParams();

	// Get a specific query parameter
	const activation_token = searchParams.get("activation_token");
	console.log(activation_token);

	useEffect(() => {
		if (activation_token) {
			axios
				.post(`${server}/seller/activation`, {
					activation_token,
				})
				.then(() => {
					setMessage("Account Verified Successfully");
				});
		}
	}, []);
	return <div>{message}</div>;
};

export default SellerActivationPage;
