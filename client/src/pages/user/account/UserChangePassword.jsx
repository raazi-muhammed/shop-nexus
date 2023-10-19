import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import server from "../../../server";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const UserChangePassword = () => {
	const navigate = useNavigate();
	const userData = useSelector((state) => state.userData.userData);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordErr, setPasswordErr] = useState("");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};
	const handleChangePassword = (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		const reqData = {
			userId: userData._id,
			currentPassword: password,
			newPassword,
		};

		axios
			.put(`${server}/user/change-password`, reqData, { withCredentials: true })
			.then((req) => {
				console.log(req);

				toast.success(req.data?.message || "Success");
				navigate("/login");
			})
			.catch((err) => {
				const message = err.response?.data?.message;
				const errorWith = err.response?.data?.errorWith;
				if (errorWith === "password") setPasswordErr(message);
				if (!errorWith) toast.error(message || "An error occurred");
			});
	};
	return (
		<main className="min-vh-100 vw-100 d-flex justify-content-center align-items-center ">
			<section className="p-5 bg-white rounded-4 container-max-width-form">
				<h4 className="text-primary m-0 fw-bold"> Change Password </h4>
				<p className="text-secondary">Hello, {userData.fullName}</p>
				<form
					noValidate
					className={validationSetting}
					onChange={handleFormChange}
					onSubmit={handleChangePassword}>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Current Password
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
					<div className="mb-3">
						<label htmlFor="new-password" className="form-label">
							New Password
						</label>
						<input
							type="password"
							className="form-control"
							id="new-password"
							name="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							pattern=".{4,}"
							required
						/>
						<div class="invalid-feedback">4 characters minimum</div>
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
							pattern={`(?:${newPassword})`}
							required
						/>
						<div class="invalid-feedback">Confirm password isn't matching</div>
					</div>
					<button
						disabled={!allowSubmission}
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Change Password
					</button>
					<p className="text-center mt-3">
						<Link className="text-secondary fw-bold" to="/user/forgot-password">
							Forgot Password?
						</Link>
					</p>
				</form>
			</section>
		</main>
	);
};

export default UserChangePassword;
