import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import server from "../../../server";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import toast from "react-hot-toast";
import { debounce } from "lodash";
const SuccessPage = () => {
	const orderState = useSelector((state) => state.order);
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();
	const [isOrderPlaced, setIsOrderPlaced] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(
		debounce(() => {
			axios
				.post(
					`${server}/order/add-to-order`,
					{ orderState },
					{ withCredentials: true }
				)
				.then((res) => {
					setIsOrderPlaced(true);
					console.log(res);
					setMessage(res.data.details);
					axios
						.delete(`${server}/cart/clear-all-cart-items`, {
							withCredentials: true,
						})
						.then((res) => {
							dispatch(setUserDataReducer(res.data.user));
						})
						.catch((err) => {
							console.log(err);
							toast.error(err?.response?.data?.message || "Some Error ocurred");
						});
				})
				.catch((err) => {
					console.log(err);
					toast.error(err?.response?.data?.message || "Some Error ocurred");
				});
		}, 1000),
		[]
	);
	return (
		<div className="text-start col-12 col-md-6 mx-auto">
			{isOrderPlaced ? (
				<div>
					<p className="display-1 fw-bold text-primary mt-5 pt-5">
						Order Status
					</p>
					<section className="text-start">
						{message.map((msg) => (
							<div>
								<p className="text-secondary h5 fw-bold mb-1">{msg.name}</p>
								<div className="d-flex">
									{msg.success ? (
										<p className="text-success bg-success-subtle p-2 px-3 rounded-4">
											{msg.status}
										</p>
									) : (
										<p className="text-danger bg-danger-subtle p-2 px-3 rounded-4">
											{msg.status}
										</p>
									)}
								</div>
							</div>
						))}
					</section>
					<Link to={"/"}>
						<button className="btn btn-secondary px-3 btn-sm rounded-pill text-white mb-2 ">
							Browse Other Products
						</button>
					</Link>
				</div>
			) : (
				<p className="text-secondary mt-5">Order is being placed...</p>
			)}
		</div>
	);
};

export default SuccessPage;
