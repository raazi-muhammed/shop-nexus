import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import server from "../../server";

const CancelOrderButton = ({ orderId, productOrderId, setRefresh }) => {
	const [reason, setReason] = useState("");

	const handleCancelOrder = (e) => {
		e.preventDefault();
		axios.defaults.withCredentials = true;

		console.log(productOrderId, orderId);
		axios
			.put(
				`${server}/user/cancel-order/${orderId}`,
				{ description: reason, productOrderId },
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				toast.success("Order Canceled");
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
					Order Cancelation
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
					<button
						onClick={(e) => handleCancelOrder(e)}
						className="btn btn-sm btn-danger">
						Cancel Order
					</button>
				</form>
			</div>
		</section>
	);
};

export default CancelOrderButton;
