import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import server from "../../../server";
import formatPrice from "../../../utils/formatPrice";
import { useSelector } from "react-redux";
import convertISOToDate from "../../../utils/convertISOToDate";
import ClipLoader from "react-spinners/ClipLoader";
import OrderCardMain from "../../../components/OrderCardMain";

const UserAllOrders = () => {
	const [loading, setLoading] = useState(false);
	const userData = useSelector((state) => state.userData.userData);

	const navigate = useNavigate();
	const [orderData, setOrderData] = useState(null);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/user/get-all-orders`, {
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
				<p className="text-secondary">You haven't Ordered anything</p>
			) : (
				<section>
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
				</section>
			)}
		</div>
	);
};

export default UserAllOrders;
