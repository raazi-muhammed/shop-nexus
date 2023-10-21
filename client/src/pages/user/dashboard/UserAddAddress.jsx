import axios from "axios";
import React, { useState } from "react";
import server from "../../../server";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import { useDispatch } from "react-redux";

const UserAddAddress = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pinCode, setPinCode] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [addressType, setAddressType] = useState("Home");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	const addressData = {
		fullName,
		phoneNumber,
		pinCode,
		state,
		city,
		addressLine1,
		addressLine2,
		addressType,
	};

	const handleAddAddress = (e) => {
		e.preventDefault();
		axios
			.post(`${server}/user/add-address`, addressData, {
				withCredentials: true,
			})
			.then((res) => {
				//replaced the last part of URL
				dispatch(setUserDataReducer(res.data.user));
				navigate(location.pathname.replace(/[^/]*$/, "address"));
				toast.success(res.data.message || "Address Added");
			})
			.catch((err) =>
				toast.error(err.response.data.message || "An Error occurred")
			);
	};

	return (
		<form
			noValidate
			className={`${formClass} ${validationSetting}`}
			onChange={handleFormChange}
			onSubmit={handleAddAddress}>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					Full Name
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					Phone Number
				</label>
				<div className={inputDivClass}>
					<input
						type="tel"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						pattern="^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)\s?)?\d{10,14}$"
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					Pin Code
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={pinCode}
						onChange={(e) => setPinCode(e.target.value)}
						pattern="^\d{6}$"
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					State
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={state}
						onChange={(e) => setState(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					City
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-1" className={formLabelClass}>
					Address Line 1
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-1"
						name="addressLine1"
						value={addressLine1}
						onChange={(e) => setAddressLine1(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="address-line-2" className={formLabelClass}>
					Address Line 2
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="address-line-2"
						name="addressLine2"
						value={addressLine2}
						onChange={(e) => setAddressLine2(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="categorySelect" className={formLabelClass}>
					Address Type
				</label>
				<div className={inputDivClass}>
					<select
						className="form-select"
						id="categorySelect"
						value={addressType}
						onChange={(e) => setAddressType(e.target.value)}>
						<option value="Home">Home</option>
						<option value="Work">Work</option>
					</select>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<button
				disabled={!allowSubmission}
				type="submit"
				className={submitButtonClass}>
				Add Address
			</button>
		</form>
	);
};

export default UserAddAddress;
