import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import orderStateConstants from "../../constants/orderStateConstants";
import toast from "react-hot-toast";

const ChangeStatusButton = ({
	currentOrderState,
	orderId,
	productOrderId,
	setRefresh,
}) => {
	const [orderState, setOrderState] = useState(currentOrderState);
	const handleOrderStatusChange = (e) => {
		e.preventDefault();
		axios
			.patch(
				`${server}/order/change-order-status/${orderId}`,
				{
					orderStatus: orderState,
					productOrderId,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				setRefresh((refresh) => !refresh);
				toast.success(res?.data?.message || "Success");
			})
			.catch((err) => console.log(err));
	};

	return (
		<section>
			<div class="dropdown">
				<button
					type="button"
					class="btn btn-sm w-100 bg-secondary-subtle text-secondary dropdown-toggle"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					data-bs-auto-close="outside">
					Change Status
				</button>
				<form class="dropdown-menu p-4">
					<div class="mb-3" style={{ width: "15rem" }}>
						<section className="my-4">
							<p className="m-0 p-0">Change Order Status</p>
							<div className="d-flex ">
								<select
									value={orderState}
									onChange={(e) => setOrderState(e.target.value)}
									className="form-select"
									id="categorySelect">
									{orderStateConstants.map((orderSt) => (
										<option value={orderSt.key}>{orderSt.value}</option>
									))}
								</select>
							</div>
						</section>
					</div>
					<button
						onClick={handleOrderStatusChange}
						className="btn btn-sm btn-danger">
						Change Status
					</button>
				</form>
			</div>
		</section>
	);
};

export default ChangeStatusButton;
