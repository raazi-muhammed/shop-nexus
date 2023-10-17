import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import server from "../../server";
import convertISOToDate from "../../utils/convertISOToDate";

const SellerAllOrders = () => {
	const userData = useSelector((state) => state.userData.userData);
	const { shopId } = useParams();
	const navigate = useNavigate();
	const [orderData, setOrderData] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/seller/get-all-orders/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderData(res.data.orderData);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			});
	}, []);

	return (
		<div className="w-100">
			{orderData.length === 0 ? (
				<p className="text-secondary">There aren't any orders</p>
			) : (
				<div className="table-responsive px-3 py-2">
					<table className="table">
						<thead className="d-flex flex-column gap-3">
							<tr className="row flex-nowrap">
								<th className="col-1 text-secondary bg-transparent py-0">No</th>
								<th className="col-3 text-secondary bg-transparent py-0">
									Order Id
								</th>
								<th className="col-1 text-secondary bg-transparent py-0">
									Items
								</th>
								<th className="col-3 text-secondary bg-transparent py-0">
									Address
								</th>
								<th className="col-1 text-secondary bg-transparent py-0">
									Date
								</th>
								<th className="col-1 text-secondary bg-transparent py-0">
									Price
								</th>
								<th className="col-2 text-secondary bg-transparent py-0">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="d-flex flex-column gap-3 ">
							{orderData?.map((order, i) => (
								<tr key={i} className="row flex-nowrap">
									<td className="col-1 rounded-start text-start">{`${
										i + 1
									}`}</td>
									<td className="col-3 text-nowrap overflow-ellipsis">
										<Link className="text-secondary" to={`${order.orderId}`}>
											{" "}
											{`${order.orderId}`}
										</Link>
									</td>
									<td className="col-1 text-nowrap overflow-ellipsis">{`${order.orderItems.length} Item(s)`}</td>
									<td className="col-3 text-nowrap overflow-ellipsis">{`${order.shippingAddress.address2}, ${order.shippingAddress.address1}, ${order.shippingAddress.city}`}</td>
									<td className="col-1 text-nowrap overflow-ellipsis">{`${convertISOToDate(
										order.createdAt
									)}`}</td>
									<td className="col-1 fw-bold">{`₹${order.totalPrice}`}</td>
									{order.status === "Canceled" ? (
										<td className="col-1 rounded-end text-danger fw-bold ">{`${order.status}`}</td>
									) : order.status === "Delivered" ? (
										<td className="col-2 rounded-end text-success fw-bold">{`${order.status}`}</td>
									) : (
										<td className="col-2 rounded-end text-warning fw-bold">{`${order.status}`}</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default SellerAllOrders;
