import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";
import server from "../../server";
import orderStatesArray from "../../utils/orderState";
import convertISOToDate from "../../utils/convertISOToDate";

const SellerSingleOrderDetails = () => {
	const [orderDetails, setOrderDetails] = useState({ orderItems: [] });
	const { shopId, orderId } = useParams();
	const [orderState, setOrderState] = useState();
	const [refresh, setRefresh] = useState(true);
	useEffect(() => {
		axios
			.get(`${server}/seller/get-order-details/${orderId}/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderDetails(res?.data?.orderData);
				setOrderState(res?.data?.orderData?.status);
			});
	}, [refresh]);

	const handleOrderStatusChange = () => {
		axios
			.patch(
				`${server}/seller/change-order-status/${orderId}`,
				{
					orderStatus: orderState,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				setRefresh(!refresh);
				toast.success(res?.data?.message || "Success");
			})
			.catch((err) => console.log(err));
		console.log("hi");
	};
	return (
		<div>
			<section className="my-4">
				<p className="m-0 p-0">Change Order Status</p>
				<div className="d-flex ">
					<select
						value={orderState}
						onChange={(e) => setOrderState(e.target.value)}
						className="form-select"
						id="categorySelect">
						{orderStatesArray.map((orderSt) => (
							<option value={orderSt}>{orderSt}</option>
						))}
					</select>
					<button
						onClick={handleOrderStatusChange}
						className="btn btn-secondary text-white text-nowrap ms-3 px-3">
						Change Status
					</button>
				</div>
			</section>
			<section className="bg-white rounded-4  p-4">
				<p className="text-small text-secondary my-2">Status</p>
				{orderDetails.status === "Canceled" ? (
					<p className="bg-danger-subtle text-danger fw-bold  p-1 px-3 rounded-pill d-inline">
						{orderDetails.status}
					</p>
				) : orderDetails.status === "Delivered" ? (
					<p className="bg-success-subtle text-success fw-bold  p-1 px-3 rounded-pill d-inline">
						{orderDetails.status}
					</p>
				) : (
					<p className="bg-warning-subtle text-warning fw-bold  p-1 px-3 rounded-pill d-inline">
						{orderDetails.status}
					</p>
				)}

				<p className="text-primary mt-3 m-0">Order Id: {orderId}</p>
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

						<p className="text-small text-secondary my-2">Payment Status</p>
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
				<section>
					<p className="mt-3 h4 fw-bold text-secondary">Events</p>
					{orderDetails?.events?.map((e) => (
						<div className="row">
							<p className="m-0 col-4 fw-bold ">{e.name}</p>
							<p className="m-0 col">{convertISOToDate(e.date, true)}</p>
						</div>
					))}
				</section>
			</section>
		</div>
	);
};

export default SellerSingleOrderDetails;
