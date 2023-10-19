import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import convertISOToDate from "../../utils/convertISOToDate";
import Pagination from "../../components/Pagination";

const AdminOrdersPage = () => {
	const navigate = useNavigate();
	const [orderData, setOrderData] = useState([]);
	const [pagination, setPagination] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-orders?page=${pagination.page || 1}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderData(res.data.orderData);
				setPagination(res.data.pagination);
			})
			.catch((err) => toast.error(err.response?.data?.message));
	}, [pagination.page]);

	return (
		<div className="w-100">
			<Pagination pagination={pagination} setPagination={setPagination} />

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
								<td className="rounded-start text-end">{`${
									pagination.startIndex + i + 1
								}`}</td>
								<td className="text-nowrap">
									<Link className="text-secondary" to={`${order.orderId}`}>
										{`${order.orderId}`}
									</Link>
								</td>
								<td className="text-nowrap">{`${order.orderItems.length} Item(s)`}</td>
								<td className="text-nowrap">{`${order.shippingAddress.address2}, ${order.shippingAddress.address1}, ${order.shippingAddress.city}`}</td>
								<td className="text-nowrap">{`${convertISOToDate(
									order.createdAt
								)}`}</td>
								<td className="fw-bold">{`₹${order.totalPrice}`}</td>
								<td className="rounded-end">{`${order.status}`}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminOrdersPage;
