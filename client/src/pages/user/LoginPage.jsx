import React, { useEffect } from "react";
import loginCover from "../../assets/login-cover.jpg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { useUserAuth } from "../../context/userAuthContext";

const LoginPage = () => {
	const navigate = useNavigate();
	const { login, user, googleSignIn, gitHubSignIn } = useUserAuth();

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

	const handleGoogleSignIn = async (e) => {
		e.preventDefault();
		try {
			const data = await googleSignIn();
			if (!data.user.email) {
				return toast.error(
					"You email is set to private, Change it to Sign in with Github"
				);
			}
			const formData = {
				email: data.user.email,
				fullName: data.user.displayName,
				avatarUrl: data.user.photoURL,
			};
			console.log(formData);
			axios
				.post(`${server}/user/provider-sign-in`, formData, {
					withCredentials: true,
				})
				.then((res) => {
					console.log(res);
					if (res.data.success) navigate("/");
				})
				.catch((err) => {
					toast.error(err.message);
				});
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleGitHubSignIn = async (e) => {
		e.preventDefault();
		try {
			const data = await gitHubSignIn();
			console.log(data.user.providerData[0]);
			const _userData = data.user.providerData[0];
			if (!_userData.email) {
				return toast.error(
					"You email is set to private, Change it to Sign in with Github"
				);
			}
			const formData = {
				email: _userData.email,
				fullName: _userData.displayName,
				avatarUrl: _userData.photoURL,
			};
			axios
				.post(`${server}/user/provider-sign-in`, formData, {
					withCredentials: true,
				})
				.then((res) => {
					console.log(res);
					if (res.data.success) navigate("/");
				})
				.catch((err) => {
					toast.error(err.message);
				});
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setAllowSubmission(false);

		const newForm = {
			email: email,
			password: password,
		};

		axios
			.post(`${server}/user/auth-user`, newForm, { withCredentials: true })
			.then(async (res) => {
				try {
					await login(email, password);
					axios
						.post(`${server}/user/login-user`, newForm, {
							withCredentials: true,
						})
						.then((res) => {
							console.log(res.data);
							if (res.data.success) navigate("/");
						})
						.catch((err) => {
							toast.error(message);
						});
				} catch (error) {
					if (
						(error.message =
							"Firebase: Error (auth/invalid-login-credentials).")
					) {
						setPasswordErr("Incorrect Password");
						return;
					}
					setPasswordErr(error.message);
					console.log(error);
				}
			})
			.catch((err) => {
				const message = err.response.data.message;
				const errorWith = err.response.data.errorWith;
				if (errorWith === "user") setEmailErr(message);
				if (errorWith === "password") setPasswordErr(message);
				if (!errorWith) toast.error(message);
			});
	};
	return (
		<main className="my-auto mx-auto row container-max-width bg-white rounded-4">
			<section className="col-6 p-0 overflow-hidden ">
				<img
					src={loginCover}
					className="rounded-start-4 m-0 h-100"
					alt=""
					srcSet=""
				/>
			</section>
			<section className="col-6 p-5 my-auto" style={{ height: "40rem" }}>
				<h3>Log In</h3>
				<p className="text-secondary">Welcome back! Log in</p>
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
							pattern=".{3,}"
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
									checked
								/>
								<label className="form-check-label" htmlFor="remember-me">
									Remember me
								</label>
							</div>
						</div>
						<Link to="/user/forgot-password" className="col-6">
							Forgot Password?
						</Link>
					</div>
					<button
						disabled={!allowSubmission}
						type="submit"
						className="btn btn-primary btn-block col-12 ">
						Log In
					</button>
				</form>
				<button
					className="btn btn-light mt-2 text-dark w-100"
					onClick={handleGoogleSignIn}>
					<img
						style={{ width: "24px" }}
						src="https://res.cloudinary.com/dklhubdqw/image/upload/f_auto,q_auto/v1/Icons/p8eeptctgl9oguvjzoro"
						alt=""
					/>
					<span className="p-1"> Sign In with Google</span>
				</button>
				<button
					className="btn bg-black mt-2 text-white w-100"
					onClick={handleGitHubSignIn}>
					<img
						style={{ width: "28px" }}
						src="https://res.cloudinary.com/dklhubdqw/image/upload/f_auto,q_auto/v1/Icons/vjj5hsfomnhzvlbdaf1b"
						alt=""
					/>
					<span className="p-1">Sign In with Github</span>
				</button>
				<p className="text-center mt-3 m-0 ">
					Don’t Have an Account{" "}
					<Link className="text-secondary fw-bold" to="/sign-up">
						Sign Up
					</Link>
				</p>
			</section>
		</main>
	);
};

export default LoginPage;
