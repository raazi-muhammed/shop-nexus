import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const ActivationPage = () => {
	const navigate = useNavigate();
	const [message, setMessage] = useState("Verification on process");
	const [searchParams, setSearchParams] = useSearchParams();
	const activation_token = searchParams.get("activation_token");
	console.log(activation_token);

	useEffect(
		debounce(() => {
			if (activation_token) {
				axios
					.post(`${server}/user/activation`, {
						activation_token,
					})
					.then(() => {
						setMessage("Account Verified Successfully");
						toast.success("Account Verified Successfully");
						navigate("/login");
					})
					.catch((err) => {
						setMessage(err.response.data.message || "Verification Failed");
					});
			}
		}, 1000),
		[]
	);

	return (
		<div className="w-100 d-flex justify-content-center align-items-center">
			<p className="text-center">{message}</p>
		</div>
	);
};

export default ActivationPage;
