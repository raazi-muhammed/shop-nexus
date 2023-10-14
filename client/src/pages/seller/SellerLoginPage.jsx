import React, { useState } from "react";
import loginCover from "../../assets/login-cover.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";

const SellerLoginPage = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailErr, setEmailErr] = useState("");
	const [passwordErr, setPasswordErr] = useState("");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		const newForm = {
			email: email,
			password: password,
		};

		axios
			.post(`${server}/seller/login-shop`, newForm, { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				if (res.data.success)
					navigate(`/seller/dashboard/${res.data.user._id}`);
			})
			.catch((err) => {
				const message = err.response.data.message;
				const errorWith = err.response.data.errorWith;
				if (errorWith === "email") setEmailErr(message);
				if (errorWith === "password") setPasswordErr(message);
				if (!errorWith) toast.error(message);
			});
	};

	return (
		<main className="my-auto mx-auto row container-max-width bg-primary text-white rounded-4">
			<section className="col-6 p-0 overflow-hidden ">
				<img src={loginCover} className="rounded-start-4 m-0" alt="" />
			</section>
			<section className="col-6 p-5 my-auto">
				<h3> Seller Log In </h3>
				<p className="text-light">Welcome back! Log in</p>
				<form
					noValidate
					onChange={handleFormChange}
					className={validationSetting}
					onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							className={`form-control ${emailErr ? "is-invalid" : ""}`}
							id="email"
							value={email}
							name="email"
							onChange={(e) => {
								setEmailErr("");
								setEmail(e.target.value);
							}}
							required
						/>
						<div class="invalid-feedback">
							{emailErr ? emailErr : "Invalid Email"}
						</div>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							className={`form-control ${passwordErr ? "is-invalid" : ""}`}
							id="password"
							name="password"
							value={password}
							onChange={(e) => {
								setPasswordErr("");
								setPassword(e.target.value);
							}}
							pattern=".{4,}"
							required
						/>
						<div class="invalid-feedback">
							{passwordErr ? passwordErr : "Invalid"}
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-6">
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									id="remember-me"
								/>
								<label className="form-check-label" htmlFor="remember-me">
									Remember me
								</label>
							</div>
						</div>
						<Link to="#" className="col-6 text-white">
							Forgot Password?
						</Link>
					</div>
					<button
						disabled={!allowSubmission}
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Log In
					</button>
				</form>
				<p className="text-center mt-3">
					Don’t Have an Account{" "}
					<Link className="text-secondary fw-bold" to="/seller/sign-up">
						{" "}
						Sign Up
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SellerLoginPage;
