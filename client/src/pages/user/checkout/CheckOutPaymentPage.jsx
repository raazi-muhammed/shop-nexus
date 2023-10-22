import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	setEvents,
	setPaymentInfo,
} from "../../../app/feature/order/orderSlice";
import { useDispatch } from "react-redux";
import Icons from "../../../assets/Icons";
const { hollowCircle, checkCircleFill } = Icons;
import toast from "react-hot-toast";
import server from "../../../server";
import axios from "axios";

const CheckOutPaymentPage = ({ totalAmount }) => {
	const [expanded, setExpanded] = useState("cod");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handlePaypal = () => {
		console.log("paypal");
	};
	const handleRazorPay = () => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onerror = () => toast.error("An error with RazorPay");
		script.onload = async () => {
			try {
				const result = await axios.post(
					`${server}/payment/create-razorpay-order`,
					{ amount: totalAmount }
				);

				const { amount, id: order_id, currency } = result.data.order;
				const {
					data: { key: razorpayKey },
				} = await axios.get(`${server}/payment/get-razorpay-key`);

				const options = {
					key: razorpayKey,
					amount: amount.toString(),
					currency: currency,
					order_id,
					name: "Shop Nexus",
					handler: async (res) => {
						const paymentInfo = {
							type: "Razorpay",
							status: "Received",
							details: res,
						};
						const eventData = {
							name: "Payment Successful",
							details: `Razorpay Payment Id: ${res.razorpay_payment_id}`,
						};
						dispatch(setPaymentInfo(paymentInfo));
						dispatch(setEvents(eventData));
						navigate("/user/checkout/success");
					},
				};
				const paymentObject = new window.Razorpay(options);
				paymentObject.open();
			} catch (error) {
				toast.error(error.message || "An error ocurred");
			}
		};
		document.body.appendChild(script);
	};
	const handleCashOnDelivery = () => {
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
					<button
						onClick={handlePaypal}
						className="mt-3 btn btn-primary btn-sm">
						Confirm
					</button>
				)}
			</section>
			<section className="bg-white p-3 rounded-4 ">
				<div onClick={() => setExpanded("razorpay")}>
					<p className="m-0 d-flex align-content-center ">
						{expanded === "razorpay" ? (
							<span className="d-block text-primary me-2">
								{checkCircleFill}
							</span>
						) : (
							<span className="d-block text-primary me-2">{hollowCircle}</span>
						)}
						Razorpay
					</p>
				</div>
				{expanded === "razorpay" && (
					<button
						onClick={handleRazorPay}
						className="mt-3 btn btn-primary btn-sm">
						Confirm
					</button>
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
