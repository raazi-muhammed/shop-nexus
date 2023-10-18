import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { useUserAuth } from "../../context/userAuthContext";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../utils/styleClasses";

const SignUpPage = () => {
	const { signUp } = useUserAuth();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [age, setAge] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [emailErr, setEmailErr] = useState("");
	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		const newForm = {
			fullName: fullName,
			email: email,
			age: age,
			password,
			confirmPassword,
		};
		try {
			await signUp(email, password);
			axios
				.post(`${server}/user/create-user`, newForm)
				.then((res) => {
					console.log(res);
					toast.success(res.data.message);
				})
				.catch((err) => {
					const message = err.response.data.message;
					const errorWith = err.response.data.errorWith;
					if (errorWith === "email") setEmailErr(message);
					if (!errorWith) toast.error(message);
				});
		} catch (error) {
			console.log(error);
			setEmailErr(error.message);
		}
	};

	return (
		<main className="row vw-100 ">
			<section className="col-12 my-auto mx-auto p-5 bg-white rounded-4 container-max-width-form">
				<h3>Create an account</h3>
				<p className="text-secondary">New to Shop Nexus? Register Now</p>
				<form
					noValidate
					className={validationSetting}
					onChange={handleFormChange}
					onSubmit={handleSubmit}>
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
						<div class="invalid-feedback">Invalid</div>
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							className={`form-control ${emailErr ? "is-invalid" : ""}`}
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setEmailErr("");
								setEmail(e.target.value);
							}}
							required
						/>
						<div class="invalid-feedback">
							{" "}
							{emailErr ? emailErr : "Invalid email"}
						</div>
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
							pattern=".{6,}"
							required
						/>
						<div class="invalid-feedback">6 characters minimum</div>
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
							pattern={`(?:${password})`}
							required
						/>
						<div class="invalid-feedback">Confirm password isn't matching</div>
					</div>

					<button
						disabled={!allowSubmission}
						type="submit"
						className="btn btn-primary btn-block col-12 ">
						Sign Up
					</button>
				</form>
				<p className="text-center mt-2">
					Alread Have an Account?{" "}
					<Link className="text-secondary fw-bold" to="/login">
						Log In
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SignUpPage;
