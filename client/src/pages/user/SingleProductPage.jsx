import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, Route, Routes, useParams } from "react-router-dom";
import RatingStar from "../../components/RatingStar";
import Icons from "../../assets/Icons";
import NavComponent from "../../components/NavComponent";
import toast from "react-hot-toast";
const { heart, cart } = Icons;
import ReactImageMagnify from "react-image-magnify";
import ProductSuggestion from "./ProductSuggestion";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import { useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import formatPrice from "../../utils/formatPrice";

const SingleProductPage = () => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const [imgSelect, setImgSelect] = useState(0);
	const [productData, setProductData] = useState({ images: [{ url: "" }] });

	const { id } = useParams();
	const [shopData, setShopData] = useState({});
	const navItems = [
		{ name: "Details", link: `/product/${id}` },
		{ name: "Reviews", link: "reviews" },
		{ name: "About Seller", link: "about-seller" },
	];

	useEffect(() => {
		setLoading(true);
		axios.defaults.withCredentials = true;
		axios
			.get(`${server}/products/single-product/${id}`)
			.then((res) => {
				setProductData(res.data.productDetails[0]);

				axios
					.get(
						`${server}/seller/get-shop-details/${res.data.productDetails[0].shop.id}`
					)
					.then((res) => {
						setShopData(res.data.data);
					});
			})
			.catch((err) => toast.error("Loading failed" + err))
			.finally(() => setLoading(false));
	}, []);

	const handleAddToCart = () => {
		const itemData = {
			product_id: id,
			name: productData.name,
			price: productData.discount_price,
			imageUrl: productData?.images[0]?.url,
		};
		axios
			.post(`${server}/cart/add-to-cart`, itemData, { withCredentials: true })
			.then((res) => {
				dispatch(setUserDataReducer(res.data.user));
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast.error(err.response?.data?.message || "Failed"));
	};

	const handleAddToWishList = () => {
		const itemData = {
			product_id: id,
			name: productData.name,
			price: productData.discount_price,
			imageUrl: productData?.images[0]?.url,
		};
		axios
			.post(`${server}/wish-list/add-to-wish-list`, itemData, {
				withCredentials: true,
			})
			.then((res) => {
				dispatch(setUserDataReducer(res.data.user));
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast.error(err.response?.data?.message || "Failed"));
	};

	return (
		<main className="vw-100">
			{loading ? (
				<div className="d-flex justify-content-center align-content-center vw-100 vh-100">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5"
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<div className="container container-lg ">
						<section className="row p-4 mx-auto w-100">
							<section className="col-12 col-sm-6 justify-content-center">
								<ReactImageMagnify
									{...{
										imageClassName: "rounded-4",
										smallImage: {
											alt: "Product Image",
											isFluidWidth: true,
											src: productData?.images[imgSelect]?.url,
										},
										largeImage: {
											src: productData?.images[imgSelect]?.url,
											width: 1200,
											height: 1200,
										},
									}}
								/>

								<section className="col-12 d-flex gap-3 justify-content-center my-4">
									{productData?.images.map((e, i) => (
										<img
											key={i}
											className="rounded-4"
											style={{
												width: "5rem",
												height: "5rem",
												objectFit: "cover",
											}}
											src={productData?.images[i]?.url}
											alt=""
											onClick={(e) => setImgSelect(i)}
										/>
									))}
								</section>
							</section>
							<section className="col-12 col-sm-6 px-4">
								<h3>{productData.name}</h3>
								<p className="text-secondary fw-bold mb-2">
									{productData.category}
								</p>
								<div className="d-flex align-items-center  gap-2 mb-3">
									<RatingStar rating={productData.rating} />
									<p className="text-small mt-2 m-0">{`${productData.total_sell} Sold`}</p>
								</div>
								<div>
									<p className="h4 mb-0 fw-bold text-primary">
										{formatPrice(productData.discount_price)}
									</p>
								</div>
								<section className="my-3 d-flex gap-2">
									<button
										onClick={handleAddToCart}
										className="btn btn-sm btn-primary d-flex gap-2 align-items-center">
										{cart} Add to Cart
									</button>
									<button
										onClick={handleAddToWishList}
										className="btn btn-sm btn-secondary text-white">
										{heart} Add to Wishlist
									</button>
								</section>
								<hr className="text-secondary my-4" />
								<section>
									<p className="text-primary fw-bold">About Seller</p>
									<section className="d-flex gap-3 align-items-center">
										<img
											className="rounded-circle "
											style={{
												width: "5rem",
												height: "5rem",
												objectFit: "cover",
											}}
											src={shopData.image?.url}
											alt=""
										/>
										<section>
											<p className="h4 fw-bold text-primary">
												{productData.shop?.name}
											</p>
											<Link to={`/shop/${shopData?._id}`}>
												<button className="btn-sm btn btn-light">
													View Shop
												</button>
											</Link>
										</section>
									</section>
								</section>
							</section>
						</section>
					</div>
					<section className="bg-white p-4">
						<div className="container container-lg ">
							<NavComponent
								className="justify-content-center "
								navItems={navItems}
							/>
							<Routes>
								<Route
									path="/"
									element={
										<section className="p-4">
											<p className="h4">{productData.name}</p>
											<p className="text-small">{productData.description}</p>
										</section>
									}
								/>
								<Route
									path="/reviews"
									element={
										<section className="p-4">
											{productData.reviews?.length == 0 ? (
												<p className="mt-3 mb-1 text-small text-center">
													No reviews yet
												</p>
											) : (
												<p className="text-small">{productData.reviews}</p>
											)}
										</section>
									}
								/>
								<Route
									path="/about-seller"
									element={
										<section className="p-4">
											<p className="h4">{shopData?.shopName}</p>
											<p className="">{shopData?.email}</p>
											<p className="text-small mb-0 ">{shopData?.address1}</p>
											<p className="text-small">{shopData?.address2}</p>
										</section>
									}
								/>
							</Routes>
						</div>
					</section>
					<section className="container container-lg ">
						<ProductSuggestion productCategory={productData.category} />
					</section>
				</>
			)}
		</main>
	);
};

export default SingleProductPage;
