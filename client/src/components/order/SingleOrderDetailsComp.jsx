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
import InvoiceDownloadButton from "./InvoiceDownloadButton";
import orderStateConstants, {
	getOrderStateByKey,
} from "../../constants/orderStateConstants";
import ChangeStatusButton from "./ChangeStatusButton";

const SingleOrderDetailsComp = ({
	orderDetails,
	orderId,
	refresh,
	setRefresh,
	showEvents,
	showChangeStatus,
}) => {
	const isReturnableFunc = () => {
		const returnMaxDate = addDays(new Date(orderDetails[0]?.createdAt), 7);
		const today = new Date();
		return returnMaxDate > today ? true : false;
	};
	const [isReturnable, setIsReturnable] = useState(isReturnableFunc);

	return (
		<>
			<section className="bg-white rounded-4  p-4">
				<p className="text-primary mt-3 m-0 text-small">
					<span className=" fw-bold"> Order Id: </span> {orderId}
				</p>
				<p className="text-primary">
					<span className="fw-bold"> Date & Time: </span>
					{convertISOToDate(orderDetails[0]?.createdAt, true)}
				</p>
				<section>
					<p className="h4 fw-bold text-secondary">Payment</p>
					<div>
						<p className="text-small text-secondary mb-0">Total Price</p>
						<p className="text-primary h5 fw-bold mb-3">
							{formatPrice(orderDetails[0]?.totalPrice)}
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
							{orderDetails?.map((order, i) => (
								<div key={i}>
									<section className="d-flex">
										<section>
											<section>
												<p className="text-small text-secondary my-2">Status</p>
												{order.status === "CANCELED" ? (
													<p className="bg-danger-subtle text-danger fw-bold  p-1 px-3 rounded-pill d-inline">
														{getOrderStateByKey(order.status)}
													</p>
												) : order.status === "DELIVERED" ||
												  order.status === "RETURN_APPROVED" ? (
													<p className="bg-success-subtle text-success fw-bold  p-1 px-3 rounded-pill d-inline">
														{getOrderStateByKey(order.status)}
													</p>
												) : (
													<p className="bg-warning-subtle text-warning fw-bold  p-1 px-3 rounded-pill d-inline">
														{getOrderStateByKey(order.status)}
													</p>
												)}
											</section>
											<OrderItemsInOrder orderItems={order.orderItems} />
										</section>

										<section className="col-3 d-flex flex-column mb-4 mt-auto gap-3 justify-content-center h-100">
											{showChangeStatus ? (
												<ChangeStatusButton
													orderId={orderId}
													productOrderId={order._id}
													setRefresh={setRefresh}
													currentOrderState={order.status}
												/>
											) : (
												<>
													{order.status === "PROCESSING" && (
														<CancelOrderButton
															orderId={orderId}
															productOrderId={order._id}
															setRefresh={setRefresh}
														/>
													)}
													{isReturnable && order.status === "DELIVERED" && (
														<ReturnButton
															orderId={order._id}
															productOrderId={order._id}
															setRefresh={setRefresh}
														/>
													)}
												</>
											)}
											<InvoiceDownloadButton orderDetails={orderDetails[i]} />
										</section>
									</section>
									<hr className="text-secondary" />
								</div>
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
						{orderDetails[0]?.events?.map((e, i) => (
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

SingleOrderDetailsComp.defaultProps = {
	showEvents: false,
	showChangeStatus: false,
};

export default SingleOrderDetailsComp;
