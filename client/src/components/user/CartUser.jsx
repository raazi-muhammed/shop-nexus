import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import Icons from "../../assets/Icons";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const { trash, close, cart } = Icons;

import { useDispatch, useSelector } from "react-redux";
import { displayCart, hideCart } from "../../app/feature/cart/cartSlice";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import formatPrice from "../../utils/formatPrice";

const CartUser = () => {
	const userData = useSelector((state) => state.userData.userData);
	const isCartVisible = useSelector((state) => state.cart.isCartVisible);
	const dispatch = useDispatch();
	const cartItems = userData?.cart;

	const navigate = useNavigate();

	const handleRemoveFromCart = (product_id) => {
		axios
			.put(
				`${server}/cart/remove-from-cart`,
				{ product_id },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch(setUserDataReducer(res.data?.user));
				toast.success(res.data?.message);
			})
			.catch((err) =>
				toast.error(err?.response?.data?.message || "An Error occurred")
			);
	};

	const handelProductClick = (id) => {
		navigate(`/product/${id}`, { replace: true });
		window.location.reload();
	};

	const handleCheckout = () => {
		dispatch(hideCart());
		navigate("/user/checkout");
	};

	useEffect(() => {
		axios
			.get(`${server}/cart/get-all-cart`, { withCredentials: true })
			.then((res) => {
				dispatch(setUserDataReducer(res.data?.user));
			})
			.catch((err) =>
				toast.error(err?.response?.data?.message || "Error Loading Wishlist")
			);
	}, [isCartVisible]);

	return (
		<>
			{isCartVisible && (
				<div
					onClick={() => dispatch(hideCart())}
					className="offcanvas-backdrop fade show"></div>
			)}

			<div
				class={`offcanvas offcanvas-end ${isCartVisible && "show"}`}
				style={{ width: "20rem" }}
				data-bs-scroll="true"
				tabindex="-1"
				id="cart">
				<section className="offcanvas-body pt-5 w-100">
					<div className="d-flex justify-content-between">
						<p className="h3 text-primary">Cart</p>
						<button
							onClick={() => dispatch(hideCart())}
							className="btn btn-light btn-sm text-secondary">
							{close}
						</button>
					</div>
					{cartItems?.length == 0 && (
						<p className="mt-3 text-sm text-secondary ">No items on Cart</p>
					)}
					{cartItems?.map((cartItem, i) => (
						<div key={i} className="col row w-100 m-0 my-2 align-items-center">
							<div className="col-3 m-0 p-0 ">
								<img
									className="m-0 w-100 p-0"
									src={
										cartItem.product?.images
											? cartItem.product?.images[0].url
											: ""
									}
								/>
							</div>
							<section
								onClick={() => handelProductClick(cartItem.product?._id)}
								className="col-7 my-auto">
								<p className="text-small mb-0">{cartItem.product?.name}</p>
								<p className="text-secondary fw-bold">{`${formatPrice(
									cartItem?.offer?.offer_price ||
										cartItem.product?.discount_price
								)} × ${cartItem.quantity}`}</p>
							</section>
							<div className="col-2 my-auto">
								<button
									onClick={(e) => handleRemoveFromCart(cartItem.product?._id)}
									className="btn btn-light text-secondary btn-sm m-0">
									{trash}
								</button>
							</div>
							<hr className="text-secondary" />
						</div>
					))}

					<button
						onClick={handleCheckout}
						className="btn btn-primary position-absolute m-3 fixed-bottom">
						Check Out
					</button>
				</section>
			</div>
		</>
	);
};

export default CartUser;
