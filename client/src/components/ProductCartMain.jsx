import React from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
import server from "../server";
import axios from "axios";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../app/feature/userData/userDataSlice";
import { useDispatch } from "react-redux";
const { heart, cart } = Icons;

const ProductCartMain = ({
	name,
	sold,
	price,
	rating,
	discount_price,
	imgUrl,
	shopName,
	productId,
}) => {
	const dispatch = useDispatch();
	const handleAddToCart = () => {
		const itemData = {
			product_id: productId,
			name: name,
			price: discount_price,
			imageUrl: imgUrl,
		};
		axios
			.post(`${server}/cart/add-to-cart`, itemData, { withCredentials: true })
			.then((res) => {
				dispatch(setUserDataReducer(res.data?.user));
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast.error(err.response?.data?.message || "Failed"));
	};
	const handleAddToWishList = () => {
		const itemData = {
			product_id: productId,
			name: name,
			price: discount_price,
			imageUrl: imgUrl,
		};
		axios
			.post(`${server}/wish-list/add-to-wish-list`, itemData, {
				withCredentials: true,
			})
			.then((res) => {
				dispatch(setUserDataReducer(res.data?.user));
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast.error(err.response?.data?.message || "Failed"));
	};
	return (
		<div className="col p-2">
			<section className=" bg-white d-flex flex-column rounded-4">
				<Link to={`/product/${productId}`}>
					<img className="rounded-4 w-100 " src={imgUrl} alt="" />
				</Link>
				<section className="d-flex flex-column p-4 pb-0 ">
					<Link className="text-secondary text-small text-decoration-none">
						{shopName}
					</Link>
					<p>{name}</p>
					<section className="d-flex gap-2">
						<p className="text-small">Rating: {rating}</p>
						<p className="text-small">{sold} Sold</p>
					</section>
					<section className="d-flex gap-1 ">
						<p className="h4 mb-0">${discount_price}</p>
						<p className="text-small text-decoration-line-through">${price}</p>
					</section>
				</section>
				<section className="m-2 d-flex gap-2">
					<button
						className="btn btn-sm btn-primary flex-grow-1 d-flex gap-2 align-items-center"
						onClick={handleAddToCart}>
						{cart} Add to Cart
					</button>
					<button
						onClick={handleAddToWishList}
						className="btn btn-sm btn-secondary text-white">
						{heart}
					</button>
				</section>
			</section>
		</div>
	);
};

export default ProductCartMain;
