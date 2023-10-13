import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const ActivationPage = () => {
	//const { activation_token } = useQuery();
	const navigate = useNavigate();
	const [message, setMessage] = useState("Verification on process");
	const [searchParams, setSearchParams] = useSearchParams();

	// Get a specific query parameter
	const activation_token = searchParams.get("activation_token");
	console.log(activation_token);

	useEffect(() => {
		if (activation_token) {
			axios
				.post(`${server}/user/activation`, {
					activation_token,
				})
				.then(() => {
					setMessage("Account Verified Successfully");
					toast.success("Account Verified Successfully");
					navigate("/login");
				});
		}
	}, []);

	return (
		<div className="w-100 d-flex justify-content-center align-items-center">
			<p className="text-center">{message}</p>
		</div>
	);
};

export default ActivationPage;
