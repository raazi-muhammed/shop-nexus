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
					axios
						.delete(`${server}/cart/clear-all-cart-items`, {
							withCredentials: true,
						})
						.then((response) =>
							dispatch(setUserDataReducer(response.data.user))
						)
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
		<div className="text-center">
			{isOrderPlaced ? (
				<div>
					<p className="display-1 fw-bold text-primary mt-5 pt-5">
						Order Placed
					</p>
					<Link to={"/"}>
						<button className="btn btn-secondary px-3 btn-sm rounded-pill text-white mb-2 ">
							Browse Other Products
						</button>
					</Link>

					{/* <Link to={`/user/dashboard/${userData._id}/orders`}>
				<p className=" mt-5 px-3  bg-light d-inline p-1 rounded-2 fw-bold text-secondary ">
					View Order
				</p>
			</Link> */}
				</div>
			) : (
				<p className="text-secondary mt-5">Order is being placed...</p>
			)}
		</div>
	);
};

export default SuccessPage;
