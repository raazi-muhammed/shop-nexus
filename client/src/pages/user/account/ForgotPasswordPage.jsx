import React, { useState } from "react";
import { useUserAuth } from "../../../context/userAuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
	const navigate = useNavigate();
	const { forgotPassword } = useUserAuth();
	const [email, setEmail] = useState();
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
		try {
			await forgotPassword(email);
			toast.success("Please check your mail");
			navigate("/login");
		} catch (err) {
			setEmailErr(err.message);
			console.log(err);
		}
	};
	return (
		<main className="min-vh-100 vw-100 d-flex justify-content-center align-items-center ">
			<section className="p-5 bg-white rounded-4 container-max-width-form">
				<h4 className="text-primary m-0 fw-bold"> Change Password </h4>
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
							name="email"
							value={email}
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

					<button
						disabled={!allowSubmission}
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Reset Password
					</button>
				</form>
			</section>
		</main>
	);
};

export default ForgotPasswordPage;
