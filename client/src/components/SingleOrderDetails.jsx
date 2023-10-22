import React, { useState } from "react";
import convertISOToDate from "../utils/convertISOToDate";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import formatPrice from "../utils/formatPrice";
import axios from "axios";
import server from "../server";
import toast from "react-hot-toast";

const SingleOrderDetails = ({
	orderDetails,
	orderId,
	refresh,
	setRefresh,
	showEvents,
}) => {
	const [invoiceLoading, setInvoiceLoading] = useState(false);
	const [reasonForCancelation, setReasonForCancelation] = useState("");

	const handleInvoiceDownload = () => {
		setInvoiceLoading(true);
		axios
			.get(`${server}/order/get-invoice/${orderId}`, {
				withCredentials: true,
			})
			.then((res) => {
				easyinvoice.download("myInvoice.pdf", res.data.result.pdf);
			})
			.catch((err) => toast.error("An Error Occurred"))
			.finally(() => {
				setInvoiceLoading(false);
			});
	};

	const handleCancelOrder = (e) => {
		e.preventDefault();
		axios.defaults.withCredentials = true;

		axios
			.put(
				`${server}/user/cancel-order/${orderId}`,
				{ description: reasonForCancelation },
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				toast.success("Order Canceled");
				setRefresh(!refresh);
			})
			.catch((err) =>
				toast.error(err?.response?.data?.message || "An error occurred")
			);
	};

	return (
		<>
			<section className="d-flex justify-content-between mb-4">
				{!(
					orderDetails.status === "Canceled" ||
					orderDetails.status === "Delivered"
				) && (
					<section>
						<div class="dropdown">
							<button
								type="button"
								class="btn btn-sm btn-danger dropdown-toggle"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-bs-auto-close="outside">
								Order Cancelation
							</button>
							<form class="dropdown-menu p-4">
								<div class="mb-3" style={{ width: "15rem" }}>
									<label for="reason-for-cancelation" class="form-label">
										Reason
									</label>
									<textarea
										type="text"
										class="form-control"
										value={reasonForCancelation}
										onChange={(e) => setReasonForCancelation(e.target.value)}
										id="reason-for-cancelation"
									/>
								</div>
								<button
									onClick={handleCancelOrder}
									className="btn btn-sm btn-danger">
									Cancel Order
								</button>
							</form>
						</div>
					</section>
				)}
				<section>
					<button
						disabled={invoiceLoading}
						onClick={handleInvoiceDownload}
						className="btn btn-dark btn-sm d-flex">
						<ClipLoader
							className="m-0 p-0 text-primary mx-auto my-auto me-1"
							loading={invoiceLoading}
							size={15}
							color="white"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
						<p>Download Invoice</p>
					</button>
				</section>
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
							{formatPrice(orderDetails.totalPrice)}
						</p>

						<p className="text-small text-secondary my-2">Payment Status</p>
						<p
							className={`fw-bold  p-1 px-3 rounded-pill d-inline ${
								orderDetails.paymentInfo?.status === "Received"
									? "bg-success-subtle text-success"
									: "bg-danger-subtle text-danger"
							}`}>
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

				{showEvents && (
					<section>
						<p className="mt-3 h4 fw-bold text-secondary">Events</p>
						{orderDetails?.events?.map((e) => (
							<div className="row">
								<p className="m-0 col-4 fw-bold ">{e.name}</p>
								<p className="m-0 col">{convertISOToDate(e.date, true)}</p>
							</div>
						))}
					</section>
				)}
			</section>
		</>
	);
};

SingleOrderDetails.defaultProps = {
	showEvents: false,
};

export default SingleOrderDetails;
