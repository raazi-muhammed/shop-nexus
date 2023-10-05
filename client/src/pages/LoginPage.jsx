import React from "react";
import loginCover from "../assets/login-cover.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<main className="my-auto mx-auto row container-max-width bg-white rounded-4">
			<section className="col-6 p-0 overflow-hidden ">
				<img
					src={loginCover}
					className="rounded-start-4 m-0"
					alt=""
					srcset=""
				/>
			</section>
			<section className="col-6 p-5 my-auto">
				<h3>Log In</h3>
				<p classNmae="text-small">please enter you details to log in</p>
				<form>
					<div className="mb-3">
						<label for="email" className="form-label">
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
						<label for="password" className="form-label">
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
								<label className="form-check-label" for="remember-me">
									Remember me
								</label>
							</div>
						</div>
						<Link to="#" className="col-6">
							Forgot Password?
						</Link>
					</div>
					<button type="submit" className="btn btn-primary btn-block col-12 ">
						Log In
					</button>
				</form>
				<p>
					Don’t Have an Account <Link to="/sign-up"> Sign Up</Link>
				</p>
			</section>
		</main>
	);
};

export default LoginPage;
