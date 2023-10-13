import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const SellerSignUpPage = () => {
	const [shopName, setShopName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [gstinNumber, setGstinNumber] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newForm = {
			shopName,
			email,
			phoneNumber,
			address1,
			address2,
			zipCode,
			password,
			confirmPassword,
			gstinNumber,
		};
		axios
			.post(`${server}/seller/crate-shop`, newForm)
			.then((res) => {
				console.log(res);
				toast.success(res.data.message);
			})
			.catch((err) => toast.error(err.response.data.message));
	};

	return (
		<main className="row vw-100 ">
			<section className="col-12 my-auto mx-auto p-5 bg-primary text-white rounded-4 container-max-width-form">
				<h3>Create an account</h3>
				<p className="text-light">New to Shop Nexus? Register Now</p>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="mb-3">
						<label htmlFor="shop-name" className="form-label">
							Shop Name
						</label>
						<input
							type="text"
							className="form-control"
							id="shop-name"
							name="shopName"
							value={shopName}
							onChange={(e) => setShopName(e.target.value)}
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
						<label htmlFor="phone-number" className="form-label">
							Phone Number
						</label>
						<input
							type="number"
							className="form-control"
							id="phone-number"
							name="phoneNumber"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="GSTIN-number" className="form-label">
							GSTIN Number
						</label>
						<input
							type="number"
							className="form-control"
							id="GSTIN-number"
							name="GSTINNumber"
							value={gstinNumber}
							onChange={(e) => setGstinNumber(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="zip-code" className="form-label">
							Zip code
						</label>
						<input
							type="number"
							className="form-control"
							id="zip-code"
							name="zipCode"
							value={zipCode}
							onChange={(e) => setZipCode(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="address1" className="form-label">
							address 1
						</label>
						<input
							type="text"
							className="form-control"
							id="address1"
							name="address1"
							value={address1}
							onChange={(e) => setAddress1(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="address2" className="form-label">
							address 2
						</label>
						<input
							type="text"
							className="form-control"
							id="address2"
							name="address2"
							value={address2}
							onChange={(e) => setAddress2(e.target.value)}
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

					<button
						type="submit"
						className="btn btn-secondary text-white btn-block col-12">
						Log In
					</button>
				</form>
				<p className="text-center mt-3">
					Alread Have an Account?{" "}
					<Link className="text-secondary fw-bold" to="/seller/login">
						Log In
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SellerSignUpPage;
