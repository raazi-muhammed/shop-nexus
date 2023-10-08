import React, { useState } from "react";
import loginCover from "../../assets/login-cover.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";

const SellerLoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const newForm = {
			email: email,
			password: password,
		};

		axios
			.post(`${server}/seller/login-shop`, newForm, { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				if (res.data.success) navigate("/seller/dashboard?");
			});
	};

	return (
		<main className="my-auto mx-auto row container-max-width bg-primary text-white rounded-4">
			<section className="col-6 p-0 overflow-hidden ">
				<img
					src={loginCover}
					className="rounded-start-4 m-0"
					alt=""
					srcSet=""
				/>
			</section>
			<section className="col-6 p-5 my-auto">
				<h3> Seller Log In </h3>
				<p className="text-small">please enter you details to log in</p>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="text"
							className="form-control"
							id="email"
							value={email}
							name="email"
							onChange={(e) => setEmail(e.target.value)}
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
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Log In
					</button>
				</form>
				<p className="text-center mt-3">
					Don’t Have an Account{" "}
					<Link className="text-secondary" to="/seller/sign-up">
						{" "}
						Sign Up
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SellerLoginPage;
