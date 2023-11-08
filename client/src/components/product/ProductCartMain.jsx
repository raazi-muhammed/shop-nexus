import React from "react";
import { Link } from "react-router-dom";
import Icons from "../../assets/Icons";
import server from "../../server";
import axios from "axios";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import { useDispatch } from "react-redux";
import formatPrice from "../../utils/formatPrice";
import RatingStar from "./RatingStar";

const { heart, cart } = Icons;

const ProductCartMain = ({ product }) => {
	const dispatch = useDispatch();

	const handleAddToCart = () => {
		const itemData = {
			product_id: product._id,
			price: product.discountPrice,
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
			product_id: product._id,
			price: product.discountPrice,
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
			<section className="h-100 bg-white d-flex flex-column rounded-4">
				<Link to={`/product/${product._id}`}>
					<img
						className="rounded-4 w-100 "
						src={product.images[0]?.url}
						alt=""
					/>
				</Link>
				<section className="d-flex flex-column p-4 pb-0 mt-auto mb-3">
					<Link className="text-secondary text-small text-decoration-none">
						{product.shop.name}
					</Link>
					<p className="mb-1">{product.name}</p>
					<section className="d-flex gap-2 mb-sm-0 mb-3">
						<RatingStar rating={product.rating} />
						<p className="text-small mt-1 d-sm-flex d-none">
							{product.totalSell} Sold
						</p>
					</section>
					<section className="d-flex gap-1">
						<p className="h4 mb-0">{formatPrice(product.discountPrice)}</p>
						<p className="text-small text-decoration-line-through d-sm-flex d-none">
							{formatPrice(product.price)}
						</p>
					</section>
				</section>
				<section className="m-2 mt-0 gap-2 d-sm-flex d-none">
					{product.stock <= 0 ? (
						<section className="w-100 m-0 mt-auto text-nowrap overflow-eclipses">
							<p className="text-small p-1 m-0 rounded-4 text-danger">
								Currently Unavailable
							</p>
						</section>
					) : (
						<button
							className="btn btn-sm btn-primary flex-grow-1 d-flex gap-2 align-items-center"
							onClick={handleAddToCart}>
							{cart} Add to Cart
						</button>
					)}
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
