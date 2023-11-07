import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import convertISOToDate from "../../../utils/convertISOToDate";
import Pagination from "../../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import RefreshButton from "../../../components/RefreshButton";
import Sorting from "../../../components/Sorting";
import OrderCardMain from "../../../components/order/OrderCardMain";

const AdminOrdersPage = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [orderData, setOrderData] = useState([]);
	const [pagination, setPagination] = useState([]);
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "createdAt", title: "Date" },
			{ value: "totalPrice", title: "Price" },
			{ value: "status", title: "Status" },
		],
	});

	useEffect(() => {
		setLoading(true);

		axios
			.get(
				`${server}/order/get-all-orders?page=${pagination.page || 1}&sort=${
					sortOptions.sortBy
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setOrderData(res.data.orderData);
				setPagination(res.data.pagination);
			})
			.catch((err) => toast.error(err.response?.data?.message))
			.finally(() => setLoading(false));
	}, [pagination.page, refresh, sortOptions]);

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
				<>
					<section className="d-flex justify-content-end gap-3 ">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<Sorting
							sortOptions={sortOptions}
							setSortOptions={setSortOptions}
						/>
						<Pagination pagination={pagination} setPagination={setPagination} />
					</section>
					{orderData?.map((order, i) => (
						<OrderCardMain
							key={i}
							status={order.status}
							createdAt={order.createdAt}
							orderItems={order.orderItems}
							totalPrice={order.totalPrice}
							shippingAddress={order.shippingAddress}
							orderId={order.orderId}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default AdminOrdersPage;
