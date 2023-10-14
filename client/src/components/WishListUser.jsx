import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../server";
import { useNavigate } from "react-router-dom";

import Icons from "../assets/Icons";
import toast from "react-hot-toast";
const { trash } = Icons;

const WishListUser = () => {
	const [wishListItems, setWishListItems] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios.defaults.withCredentials = true;
		axios
			.get(`${server}/wish-list/get-all-wish-list`, { withCredentials: true })
			.then((res) => {
				setWishListItems(res.data.wishListItems);
			})
			.catch((err) => console.log(err));
	}, []);
	const handleRemoveFromCart = (product_id) => {
		axios
			.put(
				`${server}/wish-list/remove-from-wish-list`,
				{ product_id },
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success(res.data?.message);
				setWishListItems(res.data.wishListItems);
			});
	};

	const handelProductClick = (id) => {
		navigate(`/product/${id}`, { replace: true });
		window.location.reload();
	};

	return (
		<section className="p-3 pt-5 w-100">
			<p className="h3 text-primary">Wish List</p>

			{wishListItems.length == 0 && (
				<p className="mt-3 text-sm text-secondary ">No items on wishlist</p>
			)}
			{wishListItems.map((wishListItem, i) => (
				<div key={i} className="row w-100 m-0 my-2 align-items-center">
					<div className="col-3 m-0 p-0 ">
						<img className="m-0 w-100 p-0" src={wishListItem.imageUrl} />
					</div>

					<section
						onClick={() => handelProductClick(wishListItem.product_id)}
						className="col-7 my-auto">
						<p className="text-small mb-0">{wishListItem.name}</p>
						<p className="text-secondary fw-bold">{wishListItem.price}</p>
					</section>

					<div className="col-2 my-auto">
						<button
							onClick={(e) => handleRemoveFromCart(wishListItem.product_id)}
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

export default WishListUser;
