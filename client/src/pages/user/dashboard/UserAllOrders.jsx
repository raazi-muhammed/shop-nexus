import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import server from "../../../server";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import OrderCardMain from "../../../components/order/OrderCardMain";
import Pagination from "../../../components/Pagination";
import Sorting from "../../../components/Sorting";
import RefreshButton from "../../../components/RefreshButton";

const UserAllOrders = () => {
	const userData = useSelector((state) => state.userData.userData);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "totalPrice", title: "Price" },
			{ value: "createdAt", title: "Date" },
			{ value: "status", title: "Status" },
		],
	});

	const [orderData, setOrderData] = useState([]);

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/order/get-all-orders?page=${pagination?.page || 1}&sort=${
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
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [refresh, pagination.page, sortOptions]);

	return (
		<div className="w-100">
			<section className="d-flex justify-content-end gap-3 ">
				<RefreshButton refresh={refresh} setRefresh={setRefresh} />
				<Sorting sortOptions={sortOptions} setSortOptions={setSortOptions} />
				<Pagination pagination={pagination} setPagination={setPagination} />
			</section>
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
						<section className="bg-white rounded-4 p-2 mb-3">
							<p className="text-primary fw-bold mb-1 mt-3 ms-4">
								Order Id: {order._id}
							</p>
							{order.items.map((orderItem) => (
								<OrderCardMain
									key={i}
									status={orderItem?.status}
									createdAt={orderItem?.createdAt}
									orderItems={[orderItem?.orderItems]}
									totalPrice={orderItem?.totalPrice}
									shippingAddress={orderItem?.shippingAddress}
									orderId={order._id}
								/>
							))}
						</section>
					))}
				</section>
			)}
		</div>
	);
};

export default UserAllOrders;
