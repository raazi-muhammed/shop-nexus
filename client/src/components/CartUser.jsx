import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../server";
import Icons from "../assets/Icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const { trash, close } = Icons;

import { useDispatch } from "react-redux";
import { displayCart, hideCart } from "../app/feature/cart/cartSlice";

const CartUser = () => {
	const [cartItems, setCartItems] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		axios.defaults.withCredentials = true;
		axios
			.get(`${server}/cart/get-all-cart`, { withCredentials: true })
			.then((res) => {
				setCartItems(res.data.cartItems);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleRemoveFromCart = (product_id) => {
		axios
			.put(
				`${server}/cart/remove-from-cart`,
				{ product_id },
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success(res.data?.message);
				setCartItems(res.data.cartItems);
			});
	};

	const handelProductClick = (id) => {
		navigate(`/product/${id}`, { replace: true });
		window.location.reload();
	};

	return (
		<section className="p-3 pt-5 w-100">
			<div className="d-flex justify-content-between">
				<p className="h3 text-primary">Cart</p>
				<button
					onClick={() => dispatch(hideCart())}
					className="btn btn-light btn-sm text-secondary">
					{close}
				</button>
			</div>
			{cartItems.length == 0 && (
				<p className="mt-3 text-sm text-secondary ">No items on Cart</p>
			)}
			{cartItems.map((cartItem, i) => (
				<div key={i} className="row w-100 m-0 my-2 align-items-center">
					<div className="col-3 m-0 p-0 ">
						<img className="m-0 w-100 p-0" src={cartItem.imageUrl} />
					</div>
					<section
						onClick={() => handelProductClick(cartItem.product_id)}
						className="col-7 my-auto">
						<p className="text-small mb-0">{cartItem.name}</p>
						<p className="text-secondary fw-bold">{`${cartItem.price} × ${cartItem.quantity}`}</p>
					</section>
					<div className="col-2 my-auto">
						<button
							onClick={(e) => handleRemoveFromCart(cartItem.product_id)}
							className="btn btn-light text-secondary btn-sm m-0">
							{trash}
						</button>
					</div>
					<hr className="text-secondary" />
				</div>
			))}
		</section>
	);
};

export default CartUser;
