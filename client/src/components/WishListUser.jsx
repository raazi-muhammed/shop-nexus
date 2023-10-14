import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../server";
import { useNavigate } from "react-router-dom";

import Icons from "../assets/Icons";
const { trash, close } = Icons;

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideWishList } from "../app/feature/wishList/wishListSlice";
import { setUserDataReducer } from "../app/feature/userData/userDataSlice";

const WishListUser = () => {
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();
	const wishListItems = userData.wishList;
	const navigate = useNavigate();

	const handleRemoveFromWishList = (product_id) => {
		axios
			.put(
				`${server}/wish-list/remove-from-wish-list`,
				{ product_id },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch(setUserDataReducer(res.data?.user));
				toast.success(res.data?.message);
			})
			.catch((err) =>
				toast.error(
					err?.response?.data?.message || "Cannot Remove from Wishlist"
				)
			);
	};

	const handelProductClick = (id) => {
		navigate(`/product/${id}`, { replace: true });
		window.location.reload();
	};

	return (
		<section className="p-3 pt-5 w-100">
			<div className="d-flex justify-content-between">
				<p className="h3 text-primary">Wish List</p>
				<button
					onClick={() => dispatch(hideWishList())}
					className="btn btn-light btn-sm text-secondary">
					{close}
				</button>
			</div>

			{wishListItems?.length == 0 && (
				<p className="mt-3 text-sm text-secondary ">No items on wishlist</p>
			)}
			{wishListItems?.map((wishListItem, i) => (
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
							onClick={(e) => handleRemoveFromWishList(wishListItem.product_id)}
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
