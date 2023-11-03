import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";
import {
	setShippingAddress,
	setOrderItems,
	setTotalPrice,
} from "../../../app/feature/order/orderSlice";

const CheckOutShippingPage = () => {
	const userData = useSelector((state) => state.userData.userData);
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

	const handleUseThisAddress = (_address) => {
		setFullName(_address.fullName);
		setPhoneNumber(_address.phoneNumber);
		setPinCode(_address.pinCode);
		setState(_address.state);
		setCity(_address.city);
		setAddressLine1(_address.address1);
		setAddressLine2(_address.address2);
		setAddressType(_address.addressType);

		setAllowSubmission(true);
	};

	useEffect(() => {
		userData.addresses.map((address) => {
			if (address.default) handleUseThisAddress(address);
		});
	}, []);

	const handleShippingSubmit = (e) => {
		e.preventDefault();
		const shippingInfo = {
			fullName,
			phoneNumber,
			pinCode,
			state,
			city,
			address1: addressLine1,
			address2: addressLine2,
			addressType,
		};
		const orderItems = userData.cart.map((cartItem) => {
			const data = {
				product: cartItem.product._id,
				shop: cartItem.product.shop.id,
				quantity: cartItem.quantity,
				totalPrice: cartItem.price * cartItem.quantity,
			};
			return data;
		});

		dispatch(setShippingAddress(shippingInfo));
		dispatch(setOrderItems(orderItems));

		navigate("payment");
	};

	return (
		<form
			noValidate
			className={`${formClass} ${validationSetting}`}
			onSubmit={handleShippingSubmit}
			onChange={handleFormChange}>
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
			<div className="row">
				<label htmlFor="saved-address" className={formLabelClass}></label>
				<div className={inputDivClass}>
					<div class="accordion" id="saved-address">
						<div class="accordion-item">
							<h2 class="accordion-header" id="saved-address-heading">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapseOne"
									aria-expanded="false"
									aria-controls="collapseOne">
									Choose from Saved Addresses
								</button>
							</h2>
							<div
								id="collapseOne"
								class="accordion-collapse collapse"
								aria-labelledby="saved-address-heading">
								<div class="accordion-body bg-light rounded-bottom-4 ">
									{userData?.addresses?.map((address, i) => (
										<section key={i} className="bg-white p-3 m-2 rounded-4">
											<div className="row w-100">
												<p className="text-primary fw-bold m-0">
													{`${address.fullName}, ${address.pinCode}`}{" "}
													<span className="bg-light py-1 px-3 mx-2 rounded-2 fw-normal">
														{" "}
														{address.addressType}
													</span>
												</p>
												<p className="text-small">{`${address?.address2}, ${address?.address1}, ${address?.city}`}</p>
											</div>
											<button
												type="button"
												onClick={() => handleUseThisAddress(address)}
												className="btn btn-sm btn-secondary text-white">
												Use This Address
											</button>
										</section>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<button
				disabled={!allowSubmission}
				type="submit"
				className={submitButtonClass}>
				Go to payment
			</button>
		</form>
	);
};

export default CheckOutShippingPage;
