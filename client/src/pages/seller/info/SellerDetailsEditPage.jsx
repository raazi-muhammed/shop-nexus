import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";

const SellerDetailsEditPage = () => {
	const [data, setData] = useState({});
	let { shopId } = useParams();
	const [shopName, setShopName] = useState(data.shopName);
	const [shopIcon, setShopIcon] = useState(data.shopName);
	const [shopImageUrl, setShopImageUrl] = useState(data.image?.url);
	const [email, setEmail] = useState(data.email);
	const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
	const [address1, setAddress1] = useState(data.address1);
	const [address2, setAddress2] = useState(data.address2);
	const [zipCode, setZipCode] = useState(data.zipCode);
	const [gstinNumber, setGstinNumber] = useState(data.zipCode);

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data.data);
				const {
					shopName,
					email,
					phoneNumber,
					address1,
					address2,
					zipCode,
					GSTIN_Number,
					image,
				} = res.data.data;
				setShopName(shopName);
				setEmail(email);
				setPhoneNumber(phoneNumber);
				setAddress1(address1);
				setZipCode(zipCode);
				setAddress2(address2);
				setGstinNumber(GSTIN_Number);
				setShopImageUrl(image?.url);
			})
			.catch((err) => toast.error(err.response.data.message));
	}, []);

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		setShopIcon(file);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let form_data = new FormData();
		form_data.append("file", shopIcon);
		form_data.append("shopName", shopName);
		form_data.append("email", email);
		form_data.append("phoneNumber", phoneNumber);
		form_data.append("address1", address1);
		form_data.append("address2", address2);
		form_data.append("zipCode", zipCode);
		form_data.append("gstinNumber", gstinNumber);
		form_data.append("shopId", data._id);

		const config = {
			headers: { "content-type": "multipart/form-data" },
			withCredentials: true,
		};

		axios
			.put(`${server}/seller/edit-shop-details`, form_data, config)
			.then((res) => {
				toast.success(res.data.message);
				setShopImageUrl(res.data?.shopData?.image?.url);
				toast.error("Reload if data is not updated");
			})
			.catch((res) => toast.error(JSON.stringify(res.response?.data?.message)));
	};

	return (
		<div>
			<section className="d-flex justify-content-between">
				<p className="text-small text-secondary ">Id: {data._id}</p>
				<p className="text-small text-secondary ">
					Available Balance: {data.availableBalance}
				</p>
			</section>

			<form
				noValidate
				className={`${formClass} ${validationSetting}`}
				onChange={handleFormChange}
				onSubmit={handleSubmit}>
				<div className="row align-items-center">
					<div className={formLabelClass}>
						<img
							className="rounded-circle"
							style={{ width: "4rem", height: "4rem" }}
							src={
								shopImageUrl
									? shopImageUrl
									: "http://localhost:3000/images/profile-pic-1697175479482_300657077.png"
							}
							alt=""
						/>
					</div>
					<div className={inputDivClass}>
						<input
							className="form-control"
							style={{ height: "3rem" }}
							type="file"
							id="formFileMultiple"
							accept="image/*"
							onChange={(e) => handleFileInputChange(e)}
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="shop-name" className={formLabelClass}>
						Shop Name
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="shop-name"
							name="shopName"
							value={shopName}
							onChange={(e) => setShopName(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="email" className={formLabelClass}>
						Email
					</label>
					<div className={inputDivClass}>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="phone-number" className={formLabelClass}>
						Phone Number
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="phone-number"
							name="phoneNumber"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							pattern="^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)\s?)?\d{10,14}$"
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="gstin-number" className={formLabelClass}>
						GSTIN Number
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="gstin-number"
							name="gstinNumber"
							value={gstinNumber}
							onChange={(e) => setGstinNumber(e.target.value)}
							pattern="^\d{6,}$"
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="zip-code" className={formLabelClass}>
						Zip code
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="zip-code"
							name="zipCode"
							value={zipCode}
							onChange={(e) => setZipCode(e.target.value)}
							pattern="^\d{6}$"
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="address1" className={formLabelClass}>
						address 1
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="address1"
							name="address1"
							value={address1}
							onChange={(e) => setAddress1(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="address2" className={formLabelClass}>
						address 2
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="address2"
							name="address2"
							value={address2}
							onChange={(e) => setAddress2(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>

				<button
					disabled={!allowSubmission}
					type="submit"
					className={submitButtonClass}>
					Update Data
				</button>
			</form>
		</div>
	);
};

export default SellerDetailsEditPage;
