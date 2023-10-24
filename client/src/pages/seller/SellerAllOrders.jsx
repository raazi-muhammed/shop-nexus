import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import server from "../../server";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../components/Pagination";
import OrderCardMain from "../../components/order/OrderCardMain";

const SellerAllOrders = () => {
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});
	const userData = useSelector((state) => state.userData.userData);
	const { shopId } = useParams();
	const navigate = useNavigate();
	const [orderData, setOrderData] = useState();

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/get-all-orders/${shopId}?page=${
					pagination.page || 1
				}`,
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
	}, [pagination.page]);

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
					<Pagination pagination={pagination} setPagination={setPagination} />
					{orderData?.map((order, i) => (
						<OrderCardMain
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

export default SellerAllOrders;
