import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [age, setAge] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newForm = {
			fullName: fullName,
			email: email,
			age: age,
			password,
			confirmPassword,
		};
		axios
			.post(`${server}/user/create-user`, newForm)
			.then((res) => {
				console.log(res);
				toast.success(res.data.message);
			})
			.catch((err) => toast.error(err.response.data.message));
	};
	const handleGoogle = () => {
		window.open("http://localhost:3000/auth/google", "_self");
	};

	return (
		<main className="row vw-100 ">
			<section className="col-12 my-auto mx-auto p-5 bg-white rounded-4 container-max-width-form">
				<h3>Create an account</h3>
				<p className="text-secondary">New to Shop Nexus? Register Now</p>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="mb-3">
						<label htmlFor="full-name" className="form-label">
							Full Name
						</label>
						<input
							type="text"
							className="form-control"
							id="full-name"
							name="fullName"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="age" className="form-label">
							Age
						</label>
						<input
							type="number"
							className="form-control"
							id="age"
							name="age"
							value={age}
							onChange={(e) => setAge(e.target.value)}
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
					<div className="mb-3">
						<label htmlFor="confirm-password" className="form-label">
							Confirm Password
						</label>
						<input
							type="password"
							className="form-control"
							id="confirm-password"
							name="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary btn-block col-12 ">
						Sign Up
					</button>
					{/* <button
						className="btn btn-secondary mt-2 text-white w-100"
						onClick={handleGoogle}>
						Sign In with Google
					</button> */}
				</form>
				<p className="text-center mt-2">
					Alread Have an Account?{" "}
					<Link className="text-secondary fw-bold" to="/login">
						{" "}
						Log In
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SignUpPage;
