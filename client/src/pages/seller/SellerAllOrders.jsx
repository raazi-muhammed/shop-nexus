import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import server from "../../server";
import convertISOToDate from "../../utils/convertISOToDate";
import ClipLoader from "react-spinners/ClipLoader";

const SellerAllOrders = () => {
	const [loading, setLoading] = useState(false);
	const userData = useSelector((state) => state.userData.userData);
	const { shopId } = useParams();
	const navigate = useNavigate();
	const [orderData, setOrderData] = useState();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/get-all-orders/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderData(res.data.orderData);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="w-100">
			{loading && (
				<div className="min-vh-100 w-100 d-flex justify-content-center ">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			)}
			{orderData?.length === 0 ? (
				<p className="text-secondary">There aren't any orders</p>
			) : (
				<div className="table-responsive px-3 py-2">
					<table className="table">
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
								<tr key={i}>
									<td className="rounded-start text-end">{`${i + 1}`}</td>
									<td className="col-3 text-nowrap">
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
