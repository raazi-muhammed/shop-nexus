import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CheckOutShippingPage from "./checkout/CheckOutShippingPage";
import CheckOutPaymentPage from "./checkout/CheckOutPaymentPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setTotalPrice } from "../../app/feature/order/orderSlice";
import SuccessPage from "./checkout/SuccessPage";
import server from "../../server";
import axios from "axios";
import toast from "react-hot-toast";
import formatPrice from "../../utils/formatPrice";
import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import CouponComp from "../../components/checkout/couponComp";

const CheckOutPage = () => {
	const location = useLocation();

	const userData = useSelector((state) => state.userData.userData);
	const orderState = useSelector((state) => state.order);
	const dispatch = useDispatch();

	const [totalAmountWithOutDiscount, setTotalAmountWithOutDiscount] =
		useState("-");
	const [shippingCharge, setShippingCharge] = useState(100);
	const [discountAmount, setDiscountAmount] = useState("-");
	const [totalAmount, setTotalAmount] = useState("-");

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
			const _totalAmountWithOutDiscount = userData.cart.reduce((a, e) => {
				return (a += e.price * e.quantity);
			}, 0);

			let _discountAmount;
			if (discountAmount == "-") _discountAmount = 0;
			else _discountAmount = discountAmount;

			if (userData.plusMember.active) setShippingCharge(0);
			//setDiscountAmount(_discountAmount);
			setTotalAmountWithOutDiscount(_totalAmountWithOutDiscount);
			setTotalAmount(
				_totalAmountWithOutDiscount + shippingCharge - _discountAmount
			);

			/* NEED TO REMOVE OR CHANGE */
			/* ------------------------------------------------------------------  */
			dispatch(setUser(userData._id));
			dispatch(setTotalPrice(_totalAmountWithOutDiscount - _discountAmount));
		} catch (error) {
			console.log(error);
			setDiscountAmount("-");
			setTotalAmountWithOutDiscount("-");
			setTotalAmount("-");
		}
	}, [discountAmount, userData]);

	const navItems = [
		{ name: "Shipping", link: "" },
		{ name: "Payment", link: "payment" },
		{ name: "Success", link: "success" },
	];

	const [currentNav, setCurrentNav] = useState(0);
	useEffect(() => {
		navItems.map((e, i) => {
			if (location.pathname.endsWith(e.link)) setCurrentNav(i);
		});
	}, [location.pathname]);

	return (
		<div className="container container-xxl min-vh-100">
			<div className="py-5">
				<nav className="d-flex justify-content-center mb-4">
					{navItems.map((e, i) => (
						<div className="d-flex align-items-center">
							{i !== 0 && (
								<div
									className={currentNav >= i ? "bg-primary" : "bg-light"}
									style={{ width: "3rem", height: "5px" }}></div>
							)}
							<button
								className={
									currentNav >= i
										? "btn btn-sm px-3 text-white bg-primary"
										: "btn btn-sm px-3 text-secondary bg-light"
								}>
								{e.name}
							</button>
						</div>
					))}
				</nav>

				<div className="row flex-row-reverse">
					{currentNav != 2 ? (
						<aside className="col-4">
							<section className="bg-white rounded-4 p-4">
								<p className="text-light text-small m-0">Items</p>
								{userData?.cart?.map((cartItem) => (
									<div>
										<p className="text-primary fw-bold mb-1">
											{cartItem?.product.name}{" "}
											<span className="text-small text-secondary bg-light rounded px-2">
												×{cartItem?.quantity}
											</span>
										</p>
									</div>
								))}
								<p className="text-light text-small mt-4 mb-1">Price Details</p>
								<div className="row">
									<div className="col-12 d-flex">
										<p className="col text-secondary">Price</p>
										<p className="col-3 mt-auto text-end text-secondary">
											{formatPrice(totalAmountWithOutDiscount)}
										</p>
									</div>
									<div className="col-12 d-flex">
										<p className="mb-0 col text-secondary">Shipping Charge</p>
										<p className="mb-0 col-3 mt-auto text-end text-secondary">
											{shippingCharge === 0
												? "FREE"
												: formatPrice(shippingCharge)}
										</p>
									</div>
									<Link
										to={"/shop-nexus-plus"}
										className="text-small text-light mb-2">
										Get Free shipping
									</Link>
									<div className="col-12 d-flex">
										<p className="col text-secondary">Discount</p>
										<p className="col-3 mt-auto text-end text-secondary">
											{discountAmount !== "-"
												? formatPrice(discountAmount)
												: "-"}
										</p>
									</div>
									<hr className="text-secondary" />
									<div className="col-12 d-flex">
										<p className="col text-primary fw-bold m-0">
											Discounted Amount
										</p>
										<p className="col-3 mt-auto text-end text-primary fw-bold m-0">
											{formatPrice(totalAmount)}
										</p>
									</div>
								</div>
							</section>
							<CouponComp
								totalAmountWithOutDiscount={totalAmountWithOutDiscount}
								setDiscountAmount={setDiscountAmount}
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
