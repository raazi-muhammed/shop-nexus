import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
	const navigate = useNavigate();
	const [orderData, setOrderData] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-orders`, { withCredentials: true })
			.then((res) => {
				setOrderData(res.data.orderData);
				console.log(res.data);
			})
			.catch((err) => toast.error(err.response?.data?.message));
	}, []);

	function convertISOToDate(isoDate) {
		const date = new Date(isoDate); // Create a Date object from the ISO date string
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
		const day = String(date.getDate()).padStart(2, "0");
		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
	}

	return (
		<div className="w-100">
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
								) : (
									<td className="rounded-end text-warning fw-bold">{`${order.status}`}</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminOrdersPage;
