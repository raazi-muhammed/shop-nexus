import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

const ReturnButton = ({ orderId, productOrderId, setRefresh }) => {
	const [reason, setReason] = useState("");

	const handleReturnItem = (e) => {
		e.preventDefault();
		axios.defaults.withCredentials = true;

		axios
			.put(
				`${server}/user/return-order/${orderId}`,
				{ productOrderId, description: reason },
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				toast.success(res.data?.message || "Order Returning on Process");
				setRefresh((currentRefresh) => !currentRefresh);
			})
			.catch((err) =>
				toast.error(err?.response?.data?.message || "An error occurred")
			);
	};

	return (
		<section>
			<div class="dropdown">
				<button
					type="button"
					class="btn btn-sm w-100 bg-danger-subtle text-danger dropdown-toggle"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					data-bs-auto-close="outside">
					Return Item
				</button>
				<form class="dropdown-menu p-4">
					<div class="mb-3" style={{ width: "15rem" }}>
						<label htmlFor="reason-for-cancelation" class="form-label">
							Reason
						</label>
						<textarea
							type="text"
							class="form-control"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							id="reason-for-cancelation"
						/>
					</div>
					<button onClick={handleReturnItem} className="btn btn-sm btn-danger">
						Return
					</button>
				</form>
			</div>
		</section>
	);
};

export default ReturnButton;
