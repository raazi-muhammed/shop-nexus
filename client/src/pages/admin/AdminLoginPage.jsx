import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const AdminLoginPage = () => {
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const newForm = {
			userName,
			password,
		};

		axios
			.post(`${server}/admin/login`, newForm, { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				if (res.data.success) navigate(`/admin/dashboard`);
			})
			.catch((err) => toast.error(err.response.data.message));
	};

	return (
		<main className="min-vh-100 vw-100 d-flex justify-content-center align-items-center ">
			<section className="p-5 bg-primary text-white rounded-4 container-max-width-form">
				<h3> Admin Log In </h3>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="mb-3">
						<label htmlFor="user-name" className="form-label">
							User Name
						</label>
						<input
							type="text"
							className="form-control"
							id="user-name"
							value={userName}
							name="userName"
							onChange={(e) => setUserName(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Log In
					</button>
				</form>
			</section>
		</main>
	);
};

export default AdminLoginPage;
