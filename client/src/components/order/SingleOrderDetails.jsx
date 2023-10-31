import React, { useState } from "react";
import convertISOToDate from "../../utils/convertISOToDate";
import ClipLoader from "react-spinners/ClipLoader";
import formatPrice from "../../utils/formatPrice";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { addDays } from "date-fns";
import OrderItemsInOrder from "./OrderItemsInOrder";
import ReturnButton from "./ReturnButton";
import CancelOrderButton from "./CancelOrderButton";

const SingleOrderDetails = ({
	orderDetails,
	orderId,
	refresh,
	setRefresh,
	showEvents,
}) => {
	const [invoiceLoading, setInvoiceLoading] = useState(false);
	const [reason, setReason] = useState("");

	const isReturnableFunc = () => {
		const returnMaxDate = addDays(new Date(orderDetails[0].createdAt), 7);
		const today = new Date();
		return returnMaxDate > today ? true : false;
	};
	const [isReturnable, setIsReturnable] = useState(isReturnableFunc);

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

	return (
		<>
			<section className="bg-white rounded-4  p-4">
				<p className="text-primary mt-3 m-0">Order Id: {orderId}</p>
				<p className="text-primary">
					Date: {convertISOToDate(orderDetails[0]?.createdAt, true)}
				</p>
				<section>
					<p className="h4 fw-bold text-secondary">Payment</p>
					<div>
						<p className="text-small text-secondary m-0">Total Price</p>
						<p className="text-primary h5 fw-bold">
							{formatPrice(orderDetails.totalPrice)}
						</p>

						<p className="text-small text-secondary my-2">Payment Status</p>
						<p
							className={`fw-bold  p-1 px-3 rounded-pill d-inline ${
								orderDetails[0]?.paymentInfo?.status === "Received"
									? "bg-success-subtle text-success"
									: "bg-danger-subtle text-danger"
							}`}>
							{orderDetails[0]?.paymentInfo?.status}
						</p>

						<p className="text-small text-secondary m-0 mt-3 ">Type</p>
						<p>{orderDetails[0]?.paymentInfo?.type}</p>
					</div>
				</section>
				<section>
					<p className="h4 fw-bold text-secondary">Products</p>
					<section>
						<>
							{orderDetails?.map((order) => (
								<>
									<section className="d-flex">
										<section>
											<section>
												<p className="text-small text-secondary my-2">Status</p>
												{order.status === "Canceled" ? (
													<p className="bg-danger-subtle text-danger fw-bold  p-1 px-3 rounded-pill d-inline">
														{order.status}
													</p>
												) : order.status === "Delivered" ||
												  order.status === "Return Approved" ? (
													<p className="bg-success-subtle text-success fw-bold  p-1 px-3 rounded-pill d-inline">
														{order.status}
													</p>
												) : (
													<p className="bg-warning-subtle text-warning fw-bold  p-1 px-3 rounded-pill d-inline">
														{order.status}
													</p>
												)}
											</section>
											<OrderItemsInOrder orderItems={order.orderItems} />
										</section>
										<section className="col-3 d-flex flex-column my-auto gap-3">
											{order.status === "Processing" && (
												<CancelOrderButton
													orderId={orderId}
													productOrderId={order._id}
													setRefresh={setRefresh}
												/>
											)}
											{isReturnable && order.status === "Delivered" && (
												<ReturnButton
													orderId={order._id}
													productOrderId={order._id}
													setRefresh={setRefresh}
												/>
											)}

											<section>
												<button
													disabled={invoiceLoading}
													onClick={handleInvoiceDownload}
													className="btn w-100 bg-primary-subtle text-primary btn-sm d-flex justify-content-center">
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
									</section>
									<hr className="text-secondary" />
								</>
							))}
						</>
					</section>
				</section>
				<section>
					<p className="h4 fw-bold text-secondary">Shipping Address</p>
					<div>
						<p className="text-small text-secondary m-0">Name</p>
						<p className="mb-2">{orderDetails[0]?.shippingAddress?.fullName}</p>
						<p className="text-small text-secondary m-0">Phone Number</p>
						<p className="mb-2">
							{orderDetails[0]?.shippingAddress?.phoneNumber}
						</p>
						<p className="text-small text-secondary m-0">Address Type</p>
						<p className="mb-2">
							{orderDetails[0]?.shippingAddress?.addressType}
						</p>
						<p className="text-small text-secondary m-0">Address </p>
						<p className="m-0">{`${orderDetails[0]?.shippingAddress?.address2}`}</p>
						<p className="m-0">{`${orderDetails[0]?.shippingAddress?.address1}`}</p>
						<p className="m-0">{` ${orderDetails[0]?.shippingAddress?.pinCode}, ${orderDetails[0]?.shippingAddress?.city}, ${orderDetails[0]?.shippingAddress?.state}`}</p>
					</div>
				</section>

				{showEvents && (
					<section>
						<p className="mt-3 h4 fw-bold text-secondary">Events</p>
						{orderDetails?.events?.map((e, i) => (
							<div key={i} className="row">
								<p className="m-0 col-4 fw-bold ">{e.name}</p>
								<p className="m-0 col-4">{convertISOToDate(e.date, true)}</p>
								<p className="m-0 col">{e.description}</p>
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
