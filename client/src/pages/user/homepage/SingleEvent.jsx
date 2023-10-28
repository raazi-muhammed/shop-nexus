import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import server from "../../../server";
import RatingStar from "../../../components/product/RatingStar";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import { useDispatch } from "react-redux";
import Icons from "../../../assets/Icons";
import formatPrice from "../../../utils/formatPrice";
const { cart, heart } = Icons;

const SingleEvent = () => {
	const dispatch = useDispatch();
	const { eventId } = useParams();
	const [eventData, setEventData] = useState([]);
	useEffect(() => {
		axios
			.get(`${server}/event/get-event-details/${eventId}`)
			.then((res) => {
				setEventData(res.data?.eventsData);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleAddToCart = (productId, discount_price) => {
		const itemData = {
			product_id: productId,
			price: discount_price,
			type: {
				name: "Offer",
				details: "Event Id",
			},
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
			price: discount_price,
			type: {
				name: "Offer",
				details: "Event Id",
			},
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
		<main className="vw-100 min-vh-100 pt-4">
			<div className="w-100 container container-xl ">
				<section className="row rounded-start-4">
					{eventData?.images && (
						<div className="col-6">
							<img
								className="w-100 rounded-4 m-0"
								src={eventData?.images[0]?.url}
								alt=""
							/>
						</div>
					)}
					<div className="col-6 d-flex flex-column justify-content-center">
						<h3 className="fw-bold text-secondary ">{eventData?.name}</h3>
						<p className="text-primary">{eventData?.description}</p>
					</div>
				</section>
				<hr className="text-secondary" />
				<section>
					{eventData?.selected_products?.map((product) => (
						<section className="row bg-white rounded-4  p-1">
							<div className="col-4">
								<img className="w-100" src={product?.images[0]?.url} alt="" />
							</div>
							<section className="col-8 d-flex flex-column justify-content-center">
								<Link
									to={`/product/${product._id}`}
									className="text-decoration-none">
									<div className="p-2">
										<p className="mb-0 text-small text-secondary ">
											{product?.shop?.name}
										</p>
										<p className="mb-0 h5 fw-bold text-primary">
											{product?.name}
										</p>
										<p
											className="mb-0 overflow-hidden"
											style={{ height: "3rem" }}>
											{product?.description}
										</p>
										<span className="text-light">more...</span>
										<section className="d-flex gap-1 ">
											<p className="h4 mb-0 fw-bold">
												{formatPrice(eventData?.discount_price)}
											</p>
											<p className="text-small text-decoration-line-through">
												{formatPrice(product?.discount_price)}
											</p>
											<p className="text-small text-decoration-line-through">
												{formatPrice(product?.price)}
											</p>
										</section>
										<RatingStar rating={product?.rating} />
									</div>
								</Link>
								<section className="m-2 d-flex gap-2">
									{product?.stock <= 0 ? (
										<section className="w-100 m-0 mt-auto text-nowrap overflow-eclipses">
											<p className="text-small p-1 m-0 rounded-4 text-danger">
												Currently Unavailable
											</p>
										</section>
									) : (
										<button
											className="btn btn-sm btn-primary px-2 d-flex gap-2 align-items-center"
											onClick={() =>
												handleAddToCart(product?._id, eventData?.discount_price)
											}>
											{cart} Add to Cart
										</button>
									)}
									<button
										onClick={() =>
											handleAddToWishList(
												product?._id,
												eventData?.discount_price
											)
										}
										className="btn btn-sm btn-secondary text-white">
										{heart}
									</button>
								</section>
							</section>
						</section>
					))}
				</section>
			</div>
		</main>
	);
};

export default SingleEvent;
