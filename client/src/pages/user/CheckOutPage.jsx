import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CheckOutShippingPage from "./checkout/CheckOutShippingPage";
import CheckOutPaymentPage from "./checkout/CheckOutPaymentPage";
import { useDispatch, useSelector } from "react-redux";
import {
	setUser,
	setTotalPrice,
	setOrderItems,
} from "../../app/feature/order/orderSlice";
import SuccessPage from "./checkout/SuccessPage";
import server from "../../server";
import axios from "axios";
import toast from "react-hot-toast";
import formatPrice from "../../utils/formatPrice";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import CouponComp from "../../components/checkout/couponComp";
import CheckOutNavBar from "./checkout/CheckOutNavBar";
import PriceDetails from "./checkout/PriceDetails";

const CheckOutPage = () => {
	const userData = useSelector((state) => state.userData.userData);
	const [currentNav, setCurrentNav] = useState(0);
	const orderState = useSelector((state) => state.order);
	const dispatch = useDispatch();

	const [grossPrice, setGrossPrice] = useState(0);
	const [shippingCharge, setShippingCharge] = useState(100);
	const [discountPercentage, setDiscountPercentage] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		axios
			.get(`${server}/cart/get-all-cart`, { withCredentials: true })
			.then((res) => {
				console.log(res.data?.user);
				dispatch(setUserDataReducer(res.data?.user));
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message || "Error Loading Cart");
			});
	}, []);

	useEffect(() => {
		try {
			/* Setting Gross Price  
			----------------------
			- if there is a offer price take that
			- else take discount price from product data
			- then multiply it by quantity
			- loop thought this on every item on the cart */
			const _grossPrice = userData.cart.reduce((a, cartItem) => {
				return (a +=
					(cartItem?.offer?.offerPrice || cartItem?.product.discountPrice) *
					cartItem?.quantity);
			}, 0);

			if (userData.plusMember.active) setShippingCharge(0);

			setGrossPrice(_grossPrice);
			setTotalAmount((_grossPrice + shippingCharge) * (1 - discountPercentage));

			dispatch(setUser(userData._id));
			dispatch(setTotalPrice(_grossPrice * 1 - discountPercentage));

			/* Updating Order Items Changes to Redux */
			const orderItems = userData.cart.map((cartItem) => {
				const data = {
					product: cartItem.product._id,
					shop: cartItem.product.shop.id,
					quantity: cartItem.quantity,
					price: Math.floor(
						(cartItem?.offer?.offerPrice || cartItem?.product.discountPrice) *
							cartItem?.quantity *
							(1 - discountPercentage)
					),
				};
				return data;
			});
			dispatch(setOrderItems(orderItems));
		} catch (error) {
			console.log(error);
			setDiscountPercentage(0);
			setGrossPrice(0);
			setTotalAmount(0);
		}
	}, [discountPercentage, userData]);

	return (
		<div className="container container-xxl min-vh-100">
			<div className="py-5">
				<CheckOutNavBar currentNav={currentNav} setCurrentNav={setCurrentNav} />
				<div className="row flex-row-reverse">
					{currentNav != 2 ? (
						<aside className="col-12 col-lg-4">
							<section className="bg-white rounded-4 p-4 ">
								<p className="text-light text-small m-0">Items</p>
								{userData?.cart?.map((cartItem) => (
									<div className="mb-2">
										<p className="text-primary fw-bold mb-0 ">
											{cartItem?.product.name}
										</p>
										<div className="d-flex justify-content-between text-secondary mt-2 mb-0">
											<p className="text-small mb-0">Gross Price</p>
											<p className="mb-0 text-decoration-line-through">
												<span className="text-small fw-normal">
													{`${cartItem?.quantity}×${
														cartItem?.product.price
													} = ${formatPrice(
														cartItem?.quantity * cartItem?.product.price
													)}`}
												</span>
											</p>
										</div>
										<div className="d-flex justify-content-between text-secondary fw-bold">
											<p className="text-small mb-0 mt-1">Discount Price</p>
											<p className="mb-0">
												<span className="text-small fw-normal">
													{`${cartItem?.quantity}×${
														cartItem?.offer?.offerPrice ||
														cartItem?.product.discountPrice
													} = `}
												</span>
												{formatPrice(
													cartItem?.quantity *
														(cartItem?.offer?.offerPrice ||
															cartItem?.product.discountPrice) *
														(1 - discountPercentage)
												)}
											</p>
										</div>
									</div>
								))}
								<PriceDetails
									grossPrice={grossPrice}
									shippingCharge={shippingCharge}
									totalAmount={totalAmount}
								/>
							</section>
							<CouponComp
								grossPrice={grossPrice}
								setDiscountPercentage={setDiscountPercentage}
								cartItems={userData.cart}
							/>
						</aside>
					) : null}

					<main className="col">
						<div>
							<Routes>
								<Route path="/" element={<CheckOutShippingPage />} />
								<Route
									path="/payment"
									element={<CheckOutPaymentPage totalAmount={totalAmount} />}
								/>
								<Route path="/success" element={<SuccessPage />} />
							</Routes>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default CheckOutPage;
