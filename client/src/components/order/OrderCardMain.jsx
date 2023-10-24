import React from "react";
import formatPrice from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import convertISOToDate from "../../utils/convertISOToDate";

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
			className="p-3 bg-white mb-3 row rounded-4 align-items-center ">
			<section className="col">
				<p className="text-small text-secondary m-0">Status</p>
				{status === "Canceled" ? (
					<p className="rounded-end text-danger fw-bold ">{`${status}`}</p>
				) : status === "Delivered" || status === "Return Approved" ? (
					<p className="rounded-end text-success fw-bold">{`${status}`}</p>
				) : (
					<p className="rounded-end text-warning fw-bold">{`${status}`}</p>
				)}
				<p className="text-small text-secondary m-0">Date</p>
				<p className="fw-bold m-0">{`${convertISOToDate(createdAt)}`}</p>
			</section>
			<section className="col-5">
				<p className="text-small text-secondary m-0">Items</p>
				{orderItems.map((e) => (
					<div className="mb-2">
						<p className="m-0 text-nowrap overflow-ellipsis">
							{e.product.name}
						</p>
						<p className="text-small text-primary m-0">{e.product.shop.name}</p>
					</div>
				))}
			</section>
			<section className="col">
				<p className="text-small text-secondary m-0">Total Price</p>
				<p>{formatPrice(totalPrice)}</p>
				<p className="text-small text-secondary m-0 ">Address</p>
				<p className="m-0 text-nowrap overflow-ellipsis">{`${shippingAddress.address2}, ${shippingAddress.address1}, ${shippingAddress.city}`}</p>
			</section>
		</div>
	);
};

export default OrderCardMain;
