import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import server from "../../../server";
import { useParams } from "react-router-dom";

const SalesReport = () => {
	const { shopId } = useParams();
	const [loading, setLoading] = useState(false);
	const [salesReportData, setSalesReportData] = useState([]);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/get-sales-report/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
				setSalesReportData(res.data.salesReport);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<p>SalesReport</p>

			<table class="table">
				<thead>
					<tr>
						<th scope="col">Order Date</th>
						<th scope="col">Order ID</th>
						<th scope="col">Customer Name</th>
						<th scope="col">Product Name</th>
						<th scope="col">Product ID</th>
						<th scope="col">Quantity</th>
						<th scope="col">Unit Price</th>
						<th scope="col">Total Price</th>
					</tr>
				</thead>
				<tbody>
					{salesReportData.map((sale) => (
						<tr>
							<td>{sale?.createdAt}</td>
							<td>{sale?.orderId}</td>
							<td>{sale?.user?.fullName}</td>
							<td>{sale?.orderItems[0]?.product.name}</td>
							<td>{sale?.orderItems[0]?.product._id}</td>
							<td>{sale?.orderItems[0]?.quantity}</td>
							<td>{sale?.totalPrice / sale?.orderItems[0]?.quantity}</td>
							<td>{sale?.totalPrice}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SalesReport;
