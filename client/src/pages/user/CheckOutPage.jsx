import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CheckOutShippingPage from "./checkout/CheckOutShippingPage";
import CheckOutPaymentPage from "./checkout/CheckOutPaymentPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setTotalPrice } from "../../app/feature/order/orderSlice";
import SuccessPage from "./checkout/SuccessPage";

const CheckOutPage = () => {
	const location = useLocation();

	const userData = useSelector((state) => state.userData.userData);
	const orderState = useSelector((state) => state.order);
	const dispatch = useDispatch();

	const [totalAmountWithOutDiscount, setTotalAmountWithOutDiscount] =
		useState("-");
	const [discountAmount, setDiscountAmount] = useState("-");
	const [totalAmount, setTotalAmount] = useState("-");

	useEffect(() => {
		try {
			const _totalAmountWithOutDiscount = userData.cart.reduce((a, e) => {
				return (a += e.price);
			}, 0);

			console.log(_totalAmountWithOutDiscount);

			const _discountAmount = 0;

			setDiscountAmount(_discountAmount);
			setTotalAmountWithOutDiscount(_totalAmountWithOutDiscount);
			setTotalAmount(_totalAmountWithOutDiscount - _discountAmount);
			console.log(_totalAmountWithOutDiscount - _discountAmount);

			/* NEED TO REMOVE OR CHANGE */
			/* ------------------------------------------------------------------  */
			dispatch(setUser(userData._id));
			dispatch(setTotalPrice(_totalAmountWithOutDiscount - _discountAmount));
		} catch (error) {
			console.log(error);
			setDiscountAmount("Error");
			setTotalAmountWithOutDiscount("Error");
			setTotalAmount("Error");
		}
	}, []);

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
											{JSON.stringify(totalAmountWithOutDiscount)}
										</p>
									</div>
									<div className="col-12 d-flex">
										<p className="col text-secondary">Discount</p>
										<p className="col-3 mt-auto text-end text-secondary">
											{discountAmount}
										</p>
									</div>
									<hr className="text-secondary" />
									<div className="col-12 d-flex">
										<p className="col text-primary fw-bold m-0">
											Discounted Amount
										</p>
										<p className="col-3 mt-auto text-end text-primary fw-bold m-0">
											{totalAmount}
										</p>
									</div>
								</div>
							</section>
						</aside>
					) : null}
					<main className="col">
						<div>
							<Routes>
								<Route path="/" element={<CheckOutShippingPage />} />
								<Route path="/payment" element={<CheckOutPaymentPage />} />
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
