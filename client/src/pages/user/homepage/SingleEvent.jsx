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
import ClipLoader from "react-spinners/ClipLoader";
const { cart, heart } = Icons;

const SingleEvent = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { eventId } = useParams();
	const [eventData, setEventData] = useState([]);
	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/event/get-event-details/${eventId}`)
			.then((res) => {
				setEventData(res.data?.eventsData);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
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
			{loading && (
				<div className="d-flex justify-content-center min-vh-100">
					<ClipLoader
						className="text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			)}
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
						<section
							key={product._id}
							className="row bg-white rounded-4  p-1 mb-3">
							<div className="col-3">
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
												{formatPrice(
													Math.floor(
														product?.price *
															(1 - eventData?.discount_percentage)
													)
												)}
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
												handleAddToCart(
													product?._id,
													Math.floor(
														product?.price *
															(1 - eventData?.discount_percentage)
													)
												)
											}>
											{cart} Add to Cart
										</button>
									)}
									<button
										onClick={() =>
											handleAddToWishList(
												product?._id,
												Math.floor(
													product?.price * (1 - eventData?.discount_percentage)
												)
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