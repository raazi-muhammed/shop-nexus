import React, { useEffect, useState } from "react";

import axios from "axios";
import server from "../../server";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import SellerAllProducts from "./SellerAllProducts";

import SellerAddProductPage from "./SellerAddProductPage";
import SellerDetailsEditPage from "./SellerDetailsEditPage";
import SellerEditSingleProductPage from "./SellerEditSingleProductPage";
import toast from "react-hot-toast";
import SellerAllOrders from "./SellerAllOrders";
import SellerSingleOrderDetails from "./SellerSingleOrderDetails";
import SellerStockManagement from "./SellerStockManagement";
import SellerAddCouponPage from "./SellerAddCouponPage";
import SellerAllCouponsPage from "./SellerAllCouponsPage";
import SellerEditCouponPage from "./SellerEditCouponPage";
import AsideComp from "../../components/layout/AsideComp";
import SellerNavbar from "../../components/layout/SellerNavbar";
import SellerConversationsPage from "./SellerConversationsPage";
import SellerNewEvent from "./events/SellerNewEvent";
import AllEventsSeller from "./events/AllEventsSeller";
import EditSingleEventSeller from "./events/EditSingleEventSeller";
import Icons from "../../assets/Icons";
const { threeLine } = Icons;

const SellerDashboardPage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState("");
	let { shopId } = useParams();
	const [shopName, setShopName] = useState("Loading...");

	const asideItems = [
		{
			name: "All Products",
			link: `all-products`,
		},
		{
			name: "New Product",
			link: `new-product`,
		},
		{
			name: "Stock Management",
			link: `stock-management`,
		},
		{
			name: "Edit Shop",
			link: `edit-shop`,
		},
		{
			name: "All Orders",
			link: `orders`,
		},
		{
			name: "New Coupon",
			link: `new-coupon`,
		},
		{
			name: "All Coupons",
			link: `coupons`,
		},
		{
			name: "Messages",
			link: `messages`,
		},
		{
			name: "New Event",
			link: `new-event`,
		},
		{
			name: "All Event",
			link: `events`,
		},
	];

	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data);
				setShopName(res.data.data.shopName);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<main className="vw-100">
			<SellerNavbar shopName={shopName} />
			<div className="w-100 container container-xxl  ">
				<section className="row py-5">
					<AsideComp asideItems={asideItems} />
					<section className="col">
						<Routes>
							<Route
								path="/all-products"
								element={<SellerAllProducts shopId={shopId} />}
							/>
							<Route
								path="/new-product"
								element={
									<SellerAddProductPage shopId={shopId} shopName={shopName} />
								}
							/>
							<Route path="/edit-shop" element={<SellerDetailsEditPage />} />
							<Route
								path="/stock-management"
								element={<SellerStockManagement />}
							/>
							<Route path="/orders" element={<SellerAllOrders />} />
							<Route
								path="/orders/:orderId"
								element={<SellerSingleOrderDetails />}
							/>
							<Route path="/new-coupon" element={<SellerAddCouponPage />} />
							<Route path="/coupons" element={<SellerAllCouponsPage />} />
							<Route
								path="/coupons/:couponId"
								element={<SellerEditCouponPage />}
							/>
							<Route path="/messages" element={<SellerConversationsPage />} />
							<Route path="/new-event" element={<SellerNewEvent />} />
							<Route path="/events" element={<AllEventsSeller />} />
							<Route
								path="/events/:eventId"
								element={<EditSingleEventSeller />}
							/>
							<Route
								path="/edit-single-product/:productId"
								element={<SellerEditSingleProductPage />}
							/>
						</Routes>
					</section>
				</section>
			</div>
		</main>
	);
};

export default SellerDashboardPage;
