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
		console.log(userData);
		axios
			.get(`${server}/seller/get-all-orders/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderData(res.data.orderData);
				console.log(res.data);
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
				<div class="table-responsive px-3 py-2">
					<table class="table">
						<thead>
							<tr>
								<th className="text-secondary bg-transparent py-0">No</th>
								<th className="text-secondary bg-transparent py-0">Order Id</th>
								<th className="text-secondary bg-transparent py-0">Items</th>
								<th className="text-secondary bg-transparent py-0">Address</th>
								<th className="text-secondary bg-transparent py-0">Date</th>
								<th className="text-secondary bg-transparent py-0">Price</th>
								<th className="text-secondary bg-transparent py-0">Status</th>
							</tr>
						</thead>
						<tbody>
							{orderData?.map((order, i) => (
								<tr>
									<td className="rounded-start text-end">{`${i + 1}`}</td>
									<td className="text-nowrap">
										<Link className="text-secondary" to={`${order.orderId}`}>
											{" "}
											{`${order.orderId}`}
										</Link>
									</td>
									<td className="text-nowrap">{`${order.orderItems.length} Item(s)`}</td>
									<td className="text-nowrap">{`${order.shippingAddress.address2}, ${order.shippingAddress.address1}, ${order.shippingAddress.city}`}</td>
									<td className="text-nowrap">{`${convertISOToDate(
										order.createdAt
									)}`}</td>
									<td className="fw-bold">{`₹${order.totalPrice}`}</td>
									{order.status === "Canceled" ? (
										<td className="rounded-end text-danger fw-bold ">{`${order.status}`}</td>
									) : order.status === "Delivered" ? (
										<td className="rounded-end text-success fw-bold">{`${order.status}`}</td>
									) : (
										<td className="rounded-end text-warning fw-bold">{`${order.status}`}</td>
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
