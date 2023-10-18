import React, { useState } from "react";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../utils/styleClasses";
import { useNavigate, useParams } from "react-router-dom";

const SellerAddCouponPage = () => {
	const navigate = useNavigate();
	const [couponCodeErr, setCouponCodeErr] = useState("");
	const { shopId } = useParams();
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [status, setStatus] = useState("Active");
	const [discountPercentage, setDiscountPercentage] = useState("");
	const [expires, setExpires] = useState("");
	const [minAmount, setMinAmount] = useState("");
	const [maxAmount, setMaxAmount] = useState("");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setAllowSubmission(false);

		const formData = {
			shopId,
			name,
			code,
			status,
			discountPercentage,
			expires,
			minAmount,
			maxAmount,
		};
		axios
			.post(`${server}/seller/add-coupon`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data?.message || "Success");
				navigate(`/seller/dashboard/${shopId}/coupons`);
			})
			.catch((err) => {
				const message = err.response?.data?.message;
				message ? setCouponCodeErr(message) : toast.error("An error occurred");
			});
	};
	return (
		<section>
			<form
				noValidate
				className={`${validationSetting} ${formClass}`}
				onChange={handleFormChange}
				onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Name
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={name}
							name="productName"
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Code
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className={`form-control ${couponCodeErr ? "is-invalid" : ""}`}
							id="product-name"
							value={code}
							name="code"
							onChange={(e) => {
								setCouponCodeErr("");
								setCode(e.target.value);
							}}
							pattern="^[A-Z0-9]{6,}$"
							required
						/>
						<div class="invalid-feedback">
							{couponCodeErr
								? couponCodeErr
								: "Code must be all CAPITAL with 6 characters minimum"}
						</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Status
					</label>
					<div className={inputDivClass}>
						<select
							type="text"
							className="form-select"
							id="product-name"
							value={status}
							onChange={(e) => setStatus(e.target.value)}>
							<option value="Active">Active</option>
							<option value="In Active">In Active</option>
						</select>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Discount Percentage
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={discountPercentage}
							name="discountPercentage"
							onChange={(e) => setDiscountPercentage(e.target.value)}
							pattern="^(0(\.\d*)?|1(\.0+)?)$"
							required
						/>
						<div className="invalid-feedback">
							Value must be between 0 and 1, and in the format 0.3 (not .3)
						</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Expires
					</label>
					<div className={inputDivClass}>
						<input
							type="date"
							className="form-control"
							id="product-name"
							value={expires}
							name="expires"
							onChange={(e) => setExpires(e.target.value)}
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Min Amount
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={minAmount}
							name="minAmount"
							onChange={(e) => setMinAmount(e.target.value)}
							pattern="^\d*\.?\d+$"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Max Amount
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={maxAmount}
							name="maxAmount"
							onChange={(e) => setMaxAmount(e.target.value)}
							pattern="^\d*\.?\d+$"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<button
					disabled={!allowSubmission}
					type="submit"
					className={submitButtonClass}>
					Add Coupone
				</button>
			</form>
		</section>
	);
};

export default SellerAddCouponPage;