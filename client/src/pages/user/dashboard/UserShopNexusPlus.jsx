import React from "react";
import Icons from "../../../assets/Icons";
import axios from "axios";
import server from "../../../server";
import toast from "react-hot-toast";
const { cartFill, message, calender } = Icons;
import { useNavigate } from "react-router-dom";

const UserShopNexusPlus = () => {
	const navigate = useNavigate();

	const benefits = [
		{
			heading: "Free Shipping",
			subtext: "No additional cost for home delivery.",
			icon: cartFill,
		},
		{
			heading: "Exclusive Event Access",
			subtext: "Be the first to know about special events and promotions.",
			icon: calender,
		},
		{
			heading: "Direct Shop Chat",
			subtext: "Instantly connect with the shop for questions and assistance.",
			icon: message,
		},
	];

	const handleRazorPay = () => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onerror = () => toast.error("An error with RazorPay");
		script.onload = async () => {
			try {
				const result = await axios.post(`${server}/payment/shop-nexus-plus`, {
					amount: 500,
				});

				const { id: order_id } = result.data.order;

				const {
					data: { key: razorpayKey },
				} = await axios.get(`${server}/payment/get-razorpay-key`);

				console.log(result);
				console.log(order_id, razorpayKey);

				const options = {
					key: razorpayKey,
					subscription_id: order_id,
					name: "Shop Nexus Plus",
					handler: async (res) => {
						axios.defaults.withCredentials = true;
						axios
							.put(
								`${server}/user/become-plus-member`,
								{ details: res },
								{
									withCredentials: true,
								}
							)
							.then((res) => {
								toast.success(res.data?.message || "Success");
								navigate("/shop-nexus-plus/success");
							})
							.catch((err) => console.log(err));
					},
				};
				const paymentObject = new window.Razorpay(options);
				paymentObject.open();
				paymentObject.on("payment.failed", (err) => console.log(err));
			} catch (error) {
				toast.error(error.message || "An error ocurred");
			}
		};
		document.body.appendChild(script);
	};

	/* const handleJoinPlus = () => {
		axios.defaults.withCredentials = true;

		console.log("PlusMember");
		axios
			.put(`${server}/user/become-plus-member`, { withCredentials: true })
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
	}; */

	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl  ">
				<h3 className="text-secondary">Shop Nexus Plus</h3>
				<p className="text-secondary mb-2">
					Join Shop Nexus Plus to avail exciting benefits for ₹500/month
				</p>
				<button onClick={handleRazorPay} className="btn btn-primary btn-sm">
					Join Now
				</button>

				<p className="h4 text-secondary mt-4">Benefits</p>
				<section className="row gap-4">
					{benefits.map((benefit) => (
						<div class="card col border-0">
							<div class="card-body">
								<div className="text-secondary pb-3" style={{ width: "3rem" }}>
									{benefit.icon}
								</div>
								<h5 class="card-title fw-bold text-primary">
									{benefit.heading}
								</h5>
								<p class="card-text text-small text-secondary">
									{benefit.subtext}
								</p>
							</div>
						</div>
					))}
				</section>
			</div>
		</main>
	);
};

export default UserShopNexusPlus;
