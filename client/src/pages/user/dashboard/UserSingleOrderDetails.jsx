import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import server from "../../../server";
import toast from "react-hot-toast";

const UserSingleOrderDetails = () => {
	const [orderDetails, setOrderDetails] = useState({ orderItems: [] });
	const { orderId } = useParams();

	useEffect(() => {
		axios
			.get(`${server}/user/get-order-details/${orderId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderDetails(res?.data?.orderData);
			});
	}, []);

	function convertISOToDate(isoDate) {
		const date = new Date(isoDate); // Create a Date object from the ISO date string
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
		const day = String(date.getDate()).padStart(2, "0");
		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
	}

	const handleCancelOrder = () => {
		axios.defaults.withCredentials = true;

		axios
			.put(`${server}/user/cancel-order/${orderId}`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) =>
				toast.error(err?.response?.data?.message || "An error occurred")
			);
	};

	return (
		<div>
			<section>
				<button onClick={handleCancelOrder} className="btn btn-sm btn-danger">
					{" "}
					Cancel Order
				</button>
			</section>
			<section className="bg-white rounded-4  p-4">
				<p className="text-primary m-0">Order Id: {orderId}</p>
				<p className="text-primary">
					Date: {convertISOToDate(orderDetails.createdAt)}
				</p>
				<section>
					<p className="h4 fw-bold text-secondary">Payment</p>
					<div>
						<p className="text-small text-secondary m-0">Price</p>
						<p className="text-primary h5 fw-bold">
							₹{orderDetails.totalPrice}
						</p>

						<p className="text-small text-secondary my-2">Status</p>
						<p className="bg-danger-subtle text-danger fw-bold  p-1 px-3 rounded-pill d-inline">
							{orderDetails.paymentInfo?.status}
						</p>

						<p className="text-small text-secondary m-0 mt-3 ">Type</p>
						<p>{orderDetails.paymentInfo?.type}</p>
					</div>
				</section>
				<section>
					<p className="h4 fw-bold text-secondary">Products</p>
					{orderDetails?.orderItems?.map((product, i) => (
						<div key={i} className="row my-3">
							<div className="col-3 my-auto ">
								<img
									className="w-100 rounded-3"
									src={product.product?.images[0].url || ""}
									alt=""
								/>
							</div>
							<div className="col my-auto">
								<p className="text-primary fw-bold m-0">
									{product.product.name}
								</p>
								<p className="text-small m-0">{product.product.shop.name}</p>
								<p>
									{product.product.discount_price} X
									<span>{product.quantity}</span>
								</p>
							</div>
						</div>
					))}
				</section>
				<section>
					<p className="h4 fw-bold text-secondary">Shipping Address</p>
					<div>
						<p className="text-small text-secondary m-0">Name</p>
						<p className="mb-2">{orderDetails.shippingAddress?.fullName}</p>
						<p className="text-small text-secondary m-0">Phone Number</p>
						<p className="mb-2">{orderDetails.shippingAddress?.phoneNumber}</p>
						<p className="text-small text-secondary m-0">Address Type</p>
						<p className="mb-2">{orderDetails.shippingAddress?.addressType}</p>
						<p className="text-small text-secondary m-0">Address </p>
						<p className="m-0">{`${orderDetails.shippingAddress?.address2}`}</p>
						<p className="m-0">{`${orderDetails.shippingAddress?.address1}`}</p>
						<p className="m-0">{` ${orderDetails.shippingAddress?.pinCode}, ${orderDetails.shippingAddress?.city}, ${orderDetails.shippingAddress?.state}`}</p>
					</div>
				</section>
			</section>
		</div>
	);
};

export default UserSingleOrderDetails;
