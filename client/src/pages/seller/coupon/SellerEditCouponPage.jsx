import React, { useEffect, useState } from "react";
import axios from "axios";
import server from "../../../server";
import toast from "react-hot-toast";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";
import { useNavigate, useParams } from "react-router-dom";
import convertISOToDate from "../../../utils/convertISOToDate";
import { getCouponTypeByKey } from "../../../constants/couponTypeConstants";
import categoriesConstants from "../../../constants/categoriesConstants";
import couponStateConstants from "../../../constants/couponStateConstants";

const SellerEditCouponPage = () => {
	const navigate = useNavigate();
	const today = new Date().toISOString().slice(0, 10);
	const [couponCodeErr, setCouponCodeErr] = useState("");
	const { shopId, couponId } = useParams();
	const [couponType, setCouponType] = useState("");
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [code, setCode] = useState("");
	const [status, setStatus] = useState("ACTIVE");
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

	useEffect(() => {
		axios
			.get(`${server}/seller/get-coupon-details/${couponId}`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res.data.couponData);
				const _couponData = res.data.couponData;
				setCouponType(_couponData.type);
				setName(_couponData.name);
				setCode(_couponData.code);
				setStatus(_couponData.status);
				setCategory(_couponData.category);
				setDiscountPercentage(_couponData.discountPercentage);
				setExpires(convertISOToDate(_couponData.expires, false, "input"));
				setMinAmount(_couponData.minAmount);
				setMaxAmount(_couponData.maxAmount);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "An error occurred");
			});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setAllowSubmission(false);

		const formData = {
			couponId,
			name,
			code,
			status,
			discountPercentage,
			expires,
			minAmount,
			maxAmount,
		};

		if (
			couponType === "CATEGORY_BASED_SHOP" ||
			couponType === "CATEGORY_BASED_ALL"
		) {
			formData.category = category;
		}

		axios
			.post(`${server}/seller/edit-coupon`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res.data);
				toast.success(res.data?.message || "Success");
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
						Type
					</label>
					<div className={inputDivClass}>
						<input
							disabled={true}
							type="text"
							className="form-control"
							id="product-name"
							value={getCouponTypeByKey(couponType)}
							name="productName"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
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
							disabled={true}
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
							disabled={status === "WAITING_APPROVAL" ? true : false}
							className="form-select"
							id="product-name"
							value={status}
							onChange={(e) => setStatus(e.target.value)}>
							{couponStateConstants.map((state) => (
								<option key={state.key} value={state.key}>
									{state.value}
								</option>
							))}
						</select>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				{couponType === "CATEGORY_BASED_ALL" ||
				couponType === "CATEGORY_BASED_SHOP" ? (
					<div className="row">
						<label className={formLabelClass} htmlFor="categorySelect">
							Category
						</label>
						<div className={inputDivClass}>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="form-select"
								id="categorySelect">
								<option value="">Select Category</option>
								{categoriesConstants.map((e) => (
									<option key={e.key} value={e.key}>
										{e.value}
									</option>
								))}
							</select>
						</div>
					</div>
				) : null}
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
							min={today}
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
					Update Coupon
				</button>
			</form>
		</section>
	);
};

export default SellerEditCouponPage;
