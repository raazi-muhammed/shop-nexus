import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import server from "../../server";

const SellerSignUpPage = () => {
	const [shopName, setShopName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [zipCode, setZipCode] = useState("");

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
		};
		axios
			.post(`${server}/seller/crate-shop`, newForm)
			.then((res) => {
				console.log(res);
				//navigate("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<main className="my-auto mx-auto row container-max-width bg-primary text-white rounded-4">
			<section className="col-12 p-5 my-auto">
				<h3>Create an account</h3>
				<p className="text-small">
					please enter you details to create an account
				</p>
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

					<button
						type="submit"
						className="btn btn-secondary text-white btn-block col-12 ">
						Log In
					</button>
				</form>
				<p className="text-center mt-3">
					Alread Have an Account?{" "}
					<Link className="text-secondary " to="/seller/login">
						{" "}
						Log In
					</Link>
				</p>
			</section>
		</main>
	);
};

export default SellerSignUpPage;
