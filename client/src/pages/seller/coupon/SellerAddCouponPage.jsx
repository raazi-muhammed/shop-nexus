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
import couponTypeConstants from "../../../constants/couponTypeConstants";
import categoriesConstants from "../../../constants/categoriesConstants";
import couponStateConstants from "../../../constants/couponStateConstants";
import BarLoader from "react-spinners/BarLoader";

const SellerAddCouponPage = ({ shopId }) => {
	const navigate = useNavigate();
	const today = new Date().toISOString().slice(0, 10);
	const [couponCodeErr, setCouponCodeErr] = useState("");
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [category, setCategory] = useState("");
	const [status, setStatus] = useState("ACTIVE");
	const [couponType, setCouponType] = useState("SHOP_BASED");
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
		setLoadingCreate(true);

		const formData = {
			shopId,
			name,
			type: couponType,
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
			.post(`${server}/coupon/add-coupon`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data?.message || "Success");
				navigate(`/seller/dashboard/coupons`);
			})
			.catch((err) => {
				const message = err.response?.data?.message;
				message ? setCouponCodeErr(message) : toast.error("An error occurred");
			})
			.finally(() => setLoadingCreate(false));
	};

	useEffect(() => {
		setStatus(
			couponType === "CATEGORY_BASED_ALL" || couponType === "ALL_PRODUCTS"
				? "WAITING_APPROVAL"
				: status
		);
	}, [couponType]);

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
							disabled={
								couponType === "CATEGORY_BASED_ALL" ||
								couponType === "ALL_PRODUCTS"
									? true
									: false
							}
							type="text"
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
						Coupon Type
					</label>
					<div className={inputDivClass}>
						<select
							type="text"
							className="form-select"
							id="product-name"
							value={couponType}
							onChange={(e) => setCouponType(e.target.value)}>
							{couponTypeConstants.map((type) => (
								<option key={type.key} value={type.key}>
									{type.value}
								</option>
							))}
						</select>
						<div className="invalid-feedback">Invalid</div>
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
								id="categorySelect"
								required>
								<option value="">Select Category</option>
								{categoriesConstants.map((e) => (
									<option key={e.key} value={e.key}>
										{e.value}
									</option>
								))}
							</select>
							<div className="invalid-feedback">Invalid</div>
						</div>
					</div>
				) : null}
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
				<div className="row">
					<button
						disabled={!allowSubmission}
						type="submit"
						className={submitButtonClass}>
						Add Coupon
					</button>
					<div className="col-12">
						<BarLoader
							className="m-0 p-0 text-primary mx-auto mt-1"
							loading={loadingCreate}
							color="#342475"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				</div>
			</form>
		</section>
	);
};

export default SellerAddCouponPage;
