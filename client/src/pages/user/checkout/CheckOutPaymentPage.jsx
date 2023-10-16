import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	setEvents,
	setPaymentInfo,
} from "../../../app/feature/order/orderSlice";
import { useDispatch } from "react-redux";
const CheckOutPaymentPage = () => {
	const [expanded, setExpanded] = useState("cash on delivery");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleCashOnDelivery = () => {
		console.log("COD");
		const paymentInfo = {
			type: "Cash on Delivery",
			status: "Not Received",
		};
		const eventData = {
			name: "Order Placed",
		};
		dispatch(setPaymentInfo(paymentInfo));
		dispatch(setEvents(eventData));
		navigate("/user/checkout/success");
	};
	return (
		<div className="row gap-3">
			<section className="bg-white p-3 rounded-4 ">
				<div class="form-check">
					<div onClick={() => setExpanded("paypal")}>
						<label class="form-check-label" for="flexRadioDefault1">
							Paypal
						</label>
					</div>
					{expanded === "paypal" && (
						<button className="mt-3 btn btn-primary btn-sm">Confirm</button>
					)}
				</div>
			</section>
			<section className="bg-white p-3 rounded-4 ">
				<div class="form-check">
					<div onClick={() => setExpanded("cod")}>
						<label class="form-check-label col-12" for="flexRadioDefault2">
							Cash on Delivery
						</label>
						{expanded === "cod" && (
							<button
								onClick={handleCashOnDelivery}
								className="mt-3 btn btn-primary btn-sm">
								Confirm
							</button>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default CheckOutPaymentPage;
