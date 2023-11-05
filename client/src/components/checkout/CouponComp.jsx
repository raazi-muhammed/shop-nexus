import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CouponComp = ({ grossPrice, setDiscountPercentage, cartItems }) => {
	const userData = useSelector((state) => state.userData.userData);
	const [couponCode, setCouponCode] = useState();
	const [couponData, setCouponData] = useState([]);

	const [couponErr, setCouponErr] = useState("");
	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	useEffect(() => {
		axios
			.get(`${server}/user/get-coupons-to-display?totalAmount=${grossPrice}`, {
				withCredentials: true,
			})
			.then((res) => {
				setCouponData(res.data?.couponData);
			})
			.catch((err) => console.log(err));
	}, [grossPrice]);

	const handleApplyCoupon = (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		console.log(cartItems);
		const formData = {
			totalAmount: grossPrice,
			couponCode,
			products: cartItems,
		};
		axios
			.put(`${server}/user/apply-coupon`, formData, { withCredentials: true })
			.then((res) => {
				toast.success(res.data?.message || "Success");
				setDiscountPercentage(res.data?.discountPercentage);
			})
			.catch((err) =>
				err.response?.data?.message
					? setCouponErr(err.response?.data?.message)
					: toast.error("An error occurred")
			);
	};

	return (
		<section className="bg-white rounded-4 p-4 mt-4">
			<form
				noValidate
				onChange={handleFormChange}
				className={`row ${validationSetting}`}
				onSubmit={handleApplyCoupon}>
				<div>
					<label for="coupon-code" class="form-label ms-2">
						Apply Coupon Code
					</label>

					<div class="input-group mb-3">
						<input
							type="text"
							class="form-control"
							className={`form-control ${couponErr ? "is-invalid" : ""}`}
							onChange={(e) => {
								setCouponErr("");
								setCouponCode(e.target.value);
							}}
							id="coupon-code"
							value={couponCode}
							required
						/>
						<button
							disabled={!allowSubmission}
							class="btn btn-secondary text-white rounded-end-4"
							type="submit"
							id="button-addon2">
							Apply
						</button>
						<div class="ms-2 invalid-feedback">
							{couponErr ? couponErr : "Invalid"}
						</div>
					</div>
				</div>
				{couponData.length >= 1 && (
					<section className="rounded-4">
						<div className="d-flex justify-content-between bg-secondary text-white w-100 p-3 rounded-4 ">
							<div className="">
								<p className="h5 text-white fw-bold m-0">
									Get {couponData[0].discountPercentage * 100}% OFF
								</p>
								<p className="text-white m-0">{couponData[0].code}</p>
								<p className="text-small text-light m-0">
									{couponData[0].name}
								</p>
							</div>
							<button
								onClick={() => {
									setCouponErr("");
									setCouponCode(couponData[0].code);
								}}
								className="m-0 p-0 btn btn-sm text-primary fw-bold">
								Apply
							</button>
						</div>
					</section>
				)}
				<div class="accordion mt-3" id="coupon-apply-section">
					<div class="accordion-item bg-white">
						<h2 class="accordion-header" id="coupon-apply-heading">
							<button
								class="accordion-button collapsed"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#coupon-apply"
								aria-expanded="false"
								aria-controls="coupon-apply">
								See More Coupons
							</button>
						</h2>
						<div
							id="coupon-apply"
							class="accordion-collapse collapse"
							aria-labelledby="coupon-apply-heading">
							<div class="accordion-body bg-light rounded-bottom-4 bg-white p-0">
								{couponData?.map((singleCoupon) => (
									<>
										<hr className="text-secondary m-0 " />
										<div className="d-flex justify-content-between p-3">
											<div>
												<p className="h5 text-secondary fw-bold m-0">
													Get {singleCoupon.discountPercentage * 100}% OFF
												</p>
												<p className="text-primary m-0">{singleCoupon.code}</p>
												<p className="text-small m-0">{singleCoupon.name}</p>
											</div>
											<button
												onClick={() => {
													setCouponErr("");
													setCouponCode(singleCoupon.code);
												}}
												className="m-0 p-0 btn btn-sm text-success fw-bold">
												Apply
											</button>
										</div>
									</>
								))}
							</div>
						</div>
					</div>
				</div>
			</form>
		</section>
	);
};

export default CouponComp;
