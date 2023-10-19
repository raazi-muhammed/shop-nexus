import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import server from "../../server";
import convertISOToDate from "../../utils/convertISOToDate";

import ClipLoader from "react-spinners/ClipLoader";
import SingleOrderDetails from "../../components/SingleOrderDetails";

const AdminSingleOrderDetails = () => {
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);

	const [orderDetails, setOrderDetails] = useState({ orderItems: [] });
	const { orderId } = useParams();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/admin/get-order-details/${orderId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setOrderDetails(res?.data?.orderData);
			})
			.finally(() => setLoading(false));
	}, []);

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
				<SingleOrderDetails
					orderDetails={orderDetails}
					orderId={orderId}
					setRefresh={setRefresh}
					refresh={refresh}
					showEvents={true}
				/>
			)}
		</div>
	);
};

export default AdminSingleOrderDetails;
