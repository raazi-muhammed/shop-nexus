import React from "react";
import formatPrice from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import convertISOToDate from "../../utils/convertISOToDate";
import { getOrderStateByKey } from "../../constants/orderStateConstants";

const OrderCardMain = ({
	status,
	createdAt,
	orderItems,
	totalPrice,
	shippingAddress,
	orderId,
}) => {
	const navigate = useNavigate();
	return (
		<div
			onClick={() => navigate(`${orderId}`)}
			className="p-3 w-100 mx-auto bg-white row rounded-4 align-items-center">
			<section className="col-4">
				<p className="text-small text-secondary m-0">Status</p>
				{status === "CANCELED" ? (
					<p className="rounded-end text-danger fw-bold ">
						{getOrderStateByKey(status)}
					</p>
				) : status === "DELIVERED" || status === "RETURN_APPROVED" ? (
					<p className="rounded-end text-success fw-bold">
						{getOrderStateByKey(status)}
					</p>
				) : (
					<p className="rounded-end text-warning fw-bold">
						{getOrderStateByKey(status)}
					</p>
				)}
				<p className="text-small text-secondary m-0">Date</p>
				<p className="fw-bold m-0">{`${convertISOToDate(createdAt, true)}`}</p>
				{/* <p className="text-small text-secondary m-0">{orderId}</p> */}
			</section>
			<section className="col-4">
				<p className="text-small text-secondary m-0">Items</p>
				{orderItems?.map((e, i) => (
					<div key={i} className="mb-2">
						{/* <p>{JSON.stringify(e)}</p> */}
						<p className="m-0 text-nowrap overflow-ellipsis">
							{e.product[0]?.name}
						</p>
						<p className="text-small text-primary m-0">
							{e.product[0]?.shop?.name}
						</p>
					</div>
				))}
			</section>
			<section className="col-4">
				<p className="text-small text-secondary m-0">Total Price</p>
				<p>{formatPrice(totalPrice)}</p>
				<p className="text-small text-secondary m-0 ">Address</p>
				<p className="m-0 text-nowrap overflow-ellipsis">{`${shippingAddress?.address2}, ${shippingAddress?.address1}, ${shippingAddress?.city}`}</p>
			</section>
		</div>
	);
};

export default OrderCardMain;
