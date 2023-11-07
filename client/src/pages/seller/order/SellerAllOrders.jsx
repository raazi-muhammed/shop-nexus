import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import server from "../../../server";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../../components/Pagination";
import OrderCardMain from "../../../components/order/OrderCardMain";
import Sorting from "../../../components/Sorting";
import RefreshButton from "../../../components/RefreshButton";

const SellerAllOrders = () => {
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "createdAt", title: "Date" },
			{ value: "totalPrice", title: "Price" },
			{ value: "status", title: "Status" },
		],
	});
	const [orderData, setOrderData] = useState();

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/order/get-all-orders-shop?page=${
					pagination.page || 1
				}&sort=${sortOptions.sortBy}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setOrderData(res.data.orderData);
				setPagination(res.data.pagination);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [refresh, pagination.page, sortOptions]);

	return (
		<div className="w-100">
			{loading ? (
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
			) : (
				<>
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
								<Pagination
									pagination={pagination}
									setPagination={setPagination}
								/>
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
				</>
			)}
		</div>
	);
};

export default SellerAllOrders;
