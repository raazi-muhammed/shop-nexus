import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	setEvents,
	setPaymentInfo,
} from "../../../app/feature/order/orderSlice";
import { useDispatch } from "react-redux";
import Icons from "../../../assets/Icons";
const { hollowCircle, checkCircleFill } = Icons;

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
				<div onClick={() => setExpanded("paypal")}>
					<p className="m-0 d-flex align-content-center ">
						{expanded === "paypal" ? (
							<span className="d-block text-primary me-2">
								{checkCircleFill}
							</span>
						) : (
							<span className="d-block text-primary me-2">{hollowCircle}</span>
						)}
						Paypal
					</p>
				</div>
				{expanded === "paypal" && (
					<button className="mt-3 btn btn-primary btn-sm">Confirm</button>
				)}
			</section>
			<section className="bg-white p-3 rounded-4 ">
				<div onClick={() => setExpanded("cod")}>
					<p className="m-0 d-flex align-content-center ">
						{expanded === "cod" ? (
							<span className="d-block text-primary me-2">
								{checkCircleFill}
							</span>
						) : (
							<span className="d-block text-primary me-2">{hollowCircle}</span>
						)}
						Cash On Delivery
					</p>
					{expanded === "cod" && (
						<button
							onClick={handleCashOnDelivery}
							className="mt-3 btn btn-primary btn-sm">
							Confirm
						</button>
					)}
				</div>
			</section>
		</div>
	);
};

export default CheckOutPaymentPage;
