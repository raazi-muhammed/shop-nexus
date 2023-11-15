import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const SellerActivationPage = () => {
	const navigate = useNavigate();

	const [message, setMessage] = useState("Seller Verification on process");
	const [searchParams, setSearchParams] = useSearchParams();
	const activation_token = searchParams.get("activation_token");
	console.log(activation_token);

	useEffect(
		debounce(() => {
			if (activation_token) {
				axios
					.post(`${server}/seller/activation`, {
						activation_token,
					})
					.then(() => {
						setMessage("Account Verified Successfully");
						toast.success("Account Verified Successfully");
						navigate("/seller/login");
					})
					.catch((err) => {
						setMessage(err.response.data.message || "Verification Failed");
					});
			}
		}, 1000),
		[]
	);
	return (
		<div className="vw-100 vh-100 d-flex justify-content-center align-items-center">
			{message}
		</div>
	);
};

export default SellerActivationPage;
