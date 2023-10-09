import React, { useState } from "react";

const SellerDetailsEditPage = ({ data }) => {
	const [shopName, setShopName] = useState(data.data.shopName);
	const [email, setEmail] = useState(data.data.email);
	const [phoneNumber, setPhoneNumber] = useState(data.data.phoneNumber);

	const [address1, setAddress1] = useState(data.data.address1);
	const [address2, setAddress2] = useState(data.data.address2);
	const [zipCode, setZipCode] = useState(data.data.zipCode);

	return (
		<div>
			<section className="d-flex justify-content-between">
				<p className="text-small text-secondary ">Id: {data.data?._id}</p>
				<p className="text-small text-secondary ">
					Available Balance: {data.data?.availableBalance}
				</p>
			</section>
			<form>
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

				<button
					type="submit"
					className="btn btn-secondary text-white btn-block col-12">
					Edit Data
				</button>
			</form>
		</div>
	);
};

export default SellerDetailsEditPage;
