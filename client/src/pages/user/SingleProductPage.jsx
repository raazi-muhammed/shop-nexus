import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import {
	Link,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import Icons from "../../assets/Icons";
const { heart, cart } = Icons;

import toast from "react-hot-toast";
//import ReactImageMagnify from "react-image-magnify";
import ProductSuggestion from "./ProductSuggestion";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import formatPrice from "../../utils/formatPrice";
import NavComponent from "../../components/layout/NavComponent";
import RatingStar from "../../components/product/RatingStar";
import { getCategoryByKey } from "../../constants/categoriesConstants";
import ChattingComp from "../../components/ChattingComp";
import ReviewsSection from "./product/ReviewsSection";
import QuantityPicker from "../../components/product/QuantityPicker";

const SingleProductPage = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();

	const [imgSelect, setImgSelect] = useState(0);
	const [productData, setProductData] = useState({ images: [{ url: "" }] });
	const [quantity, setQuantity] = useState(1);
	const { id } = useParams();
	const [shopData, setShopData] = useState({});
	const navItems = [
		{ name: "Details", link: `/product/${id}` },
		{ name: "Reviews", link: "reviews" },
		{ name: "About Seller", link: "about-seller" },
	];

	const [toPersonInfo, setToPersonInfo] = useState({});
	const [chatInfo, setChatInfo] = useState({
		senderId: "",
		receiverId: "",
	});

	const handleMessageShop = () => {
		if (!userData.plusMember?.active) return navigate("/shop-nexus-plus");
		axios
			.post(`${server}/conversation/get-conversation`, {
				senderId: userData._id,
				receiverId: shopData?._id,
			})
			.then((res) => {
				setChatInfo({
					senderId: userData._id,
					receiverId: shopData?._id,
				});
				setToPersonInfo({
					name: shopData?.shopName,
					imageUrl: shopData?.image?.url,
				});
			});
	};

	useEffect(() => {
		setLoading(true);
		axios.defaults.withCredentials = true;
		axios
			.get(`${server}/products/single-product/${id}`)
			.then((res) => {
				setProductData(res.data.productDetails[0]);
				setShopData(res.data.productDetails[0].shop.id);
			})
			.catch((err) => toast.error("Loading failed" + err))
			.finally(() => setLoading(false));
	}, [id]);

	const handleAddToCart = () => {
		const itemData = {
			product_id: id,
			name: productData.name,
			quantity,
			price: productData.discountPrice,
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
			price: productData.discountPrice,
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
					<div className="container container-lg">
						<section className="row p-4 mx-auto w-100 ">
							<section className="col-12 col-sm-6 justify-content-center">
								<div className="w-100">
									<img
										className="w-100 rounded-4"
										src={productData?.images[imgSelect]?.url}
										alt=""
									/>
								</div>
								{/* 
								
								<ReactImageMagnify
									className="rounded-4 z-3 "
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
 */}
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
									{getCategoryByKey(productData.category)}
								</p>
								<div className="d-flex align-items-center  gap-2 mb-3">
									<RatingStar rating={productData.rating} />
									<p className="text-small mt-2 m-0">{`${productData.totalSell} Sold`}</p>
								</div>
								{productData.stock < 20 && productData.stock !== 0 && (
									<p className="bg-danger-subtle p-1 px-2  rounded-4 d-inline text-danger">
										Only {productData.stock} Left in Stock
									</p>
								)}
								<div className="mt-3">
									<p className="h4 mb-0 fw-bold text-primary">
										{formatPrice(productData.discountPrice)}
									</p>
								</div>
								<section className="mt-3">
									<QuantityPicker
										quantity={quantity}
										setQuantity={setQuantity}
									/>
								</section>
								<section className="my-3 d-flex gap-2">
									{productData.stock <= 0 ? (
										<section>
											<p className="bg-danger-subtle p-1 px-2  rounded-4 text-danger">
												Currently Unavailable
											</p>
										</section>
									) : (
										<button
											onClick={handleAddToCart}
											className="btn btn-sm btn-primary d-flex gap-2 align-items-center">
											{cart} Add to Cart
										</button>
									)}
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
											<button
												data-bs-toggle="modal"
												data-bs-target={
													userData?.plusMember?.active && "#exampleModal"
												}
												onClick={handleMessageShop}
												className="btn-sm btn btn-secondary text-white ms-2">
												Message Shop
											</button>
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
									element={<ReviewsSection productData={productData} />}
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
			<ChattingComp chatInfo={chatInfo} toPersonInfo={toPersonInfo} />
		</main>
	);
};

export default SingleProductPage;
