import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../server";
import Icons from "../assets/Icons";
const { trash } = Icons;

const CartUser = () => {
	const [cartItems, setCartItems] = useState([]);
	useEffect(() => {
		axios.defaults.withCredentials = true;
		axios
			.get(`${server}/cart/get-all-cart`, { withCredentials: true })
			.then((res) => {
				console.log(res);
				setCartItems(res.data.cartItems);
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<section className="p-3 pt-5 w-100">
			<p className="h3 text-primary">Cart</p>

			{cartItems.map((e) => (
				<div className="row w-100 m-0 my-2 align-items-center">
					<div className="col-3 m-0 p-0 ">
						<img className="m-0 w-100 p-0" src={e.imageUrl} />
					</div>
					<section className="col-7 my-auto">
						<p className="text-small mb-0">{e.name}</p>
						<p className="text-secondary fw-bold">{`${e.price} × ${e.quantity}`}</p>
					</section>
					<div className="col-2 my-auto">
						<button className="btn btn-light text-secondary btn-sm m-0">
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
