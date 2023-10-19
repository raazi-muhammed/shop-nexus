import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";
import server from "../../server";
import orderStatesArray from "../../utils/orderState";
import SingleOrderDetails from "../../components/SingleOrderDetails";
import ClipLoader from "react-spinners/ClipLoader";

const SellerSingleOrderDetails = () => {
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);

	const [orderDetails, setOrderDetails] = useState({ orderItems: [] });
	const { shopId, orderId } = useParams();
	const [orderState, setOrderState] = useState();
	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/get-order-details/${orderId}/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderDetails(res?.data?.orderData);
				setOrderState(res?.data?.orderData?.status);
			})
			.finally(() => setLoading(false));
	}, [refresh]);

	const handleOrderStatusChange = () => {
		axios
			.patch(
				`${server}/seller/change-order-status/${orderId}`,
				{
					orderStatus: orderState,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				setRefresh(!refresh);
				toast.success(res?.data?.message || "Success");
			})
			.catch((err) => console.log(err));
		console.log("hi");
	};
	return (
		<div>
			{loading ? (
				<div className="d-flex justify-content-center align-content-center w-100 vh-100">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5"
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<section className="my-4">
						<p className="m-0 p-0">Change Order Status</p>
						<div className="d-flex ">
							<select
								value={orderState}
								onChange={(e) => setOrderState(e.target.value)}
								className="form-select"
								id="categorySelect">
								{orderStatesArray.map((orderSt) => (
									<option value={orderSt}>{orderSt}</option>
								))}
							</select>
							<button
								onClick={handleOrderStatusChange}
								className="btn btn-secondary text-white text-nowrap ms-3 px-3">
								Change Status
							</button>
						</div>
					</section>

					<SingleOrderDetails
						orderDetails={orderDetails}
						orderId={orderId}
						setRefresh={setRefresh}
						refresh={refresh}
						showEvents={true}
					/>
				</>
			)}
		</div>
	);
};

export default SellerSingleOrderDetails;
