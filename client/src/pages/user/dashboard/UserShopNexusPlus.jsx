import React from "react";
import axios from "axios";
import server from "../../../server";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import PlusBenifits from "../../../components/nexusPlus/PlusBenifits";

const UserShopNexusPlus = () => {
	const navigate = useNavigate();

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
								window.location.reload();
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
		<main className="w-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl  ">
				<h3 className="text-secondary">Shop Nexus Plus</h3>
				<p className="text-secondary mb-2">
					Join Shop Nexus Plus to avail exciting benefits for ₹500/month
				</p>
				<button onClick={handleRazorPay} className="btn btn-primary btn-sm">
					Join Now
				</button>

				<p className="h4 text-secondary mt-4">Benefits</p>
				<PlusBenifits />
			</div>
		</main>
	);
};

export default UserShopNexusPlus;
