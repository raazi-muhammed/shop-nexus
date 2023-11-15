import React, { useEffect, useState } from "react";

import axios from "axios";
import server from "../../server";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import SellerAllProducts from "./product/SellerAllProducts";
import SellerAddProductPage from "./product/SellerAddProductPage";
import SellerDetailsEditPage from "./info/SellerDetailsEditPage";
import SellerEditSingleProductPage from "./product/SellerEditSingleProductPage";
import SellerAllOrders from "./order/SellerAllOrders";
import SellerSingleOrderDetails from "./order/SellerSingleOrderDetails";
import SellerStockManagement from "./product/SellerStockManagement";
import SellerAddCouponPage from "./coupon/SellerAddCouponPage";
import SellerAllCouponsPage from "./coupon/SellerAllCouponsPage";
import SellerEditCouponPage from "./coupon/SellerEditCouponPage";
import AsideComp from "../../components/layout/AsideComp";
import SellerNavbar from "../../components/layout/SellerNavbar";
import SellerConversationsPage from "./message/SellerConversationsPage";
import SellerNewEvent from "./events/SellerNewEvent";
import AllEventsSeller from "./events/AllEventsSeller";
import EditSingleEventSeller from "./events/EditSingleEventSeller";
import Icons from "../../assets/Icons";
import SellerWalletPage from "./wallet/SellerWalletPage";
import ChartSales from "./dashboard/ChartSales";
import ChartProducts from "./dashboard/ChartProducts";
import ChartOrders from "./dashboard/ChartOrders";
import MainDashBoard from "./dashboard/MainDashBoard";
import SalesReport from "./dashboard/SalesReport";
import toast from "react-hot-toast";
const { threeLine } = Icons;

const SellerDashboardPage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState("");
	const [shopName, setShopName] = useState("Loading...");

	const asideItems = [
		{
			name: "Analytics",
			heading: true,
		},
		{
			name: "Dashboard",
			link: ``,
		},
		{
			name: "Sales",
			link: `sales`,
		},
		{
			name: "Products",
			link: `chart-products`,
		},
		{
			name: "Orders",
			link: `char-orders`,
		},
		{
			name: "Products & Orders",
			heading: true,
		},
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
			name: "All Orders",
			link: `orders`,
		},
		{
			name: "Coupon & Events",
			heading: true,
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
			name: "New Event",
			link: `new-event`,
		},
		{
			name: "All Event",
			link: `events`,
		},
		{
			name: "Others",
			heading: true,
		},
		{
			name: "Messages",
			link: `messages`,
		},
		{
			name: "Wallet",
			link: `wallet`,
		},
		{
			name: "Edit Shop",
			link: `edit-shop`,
		},
		{
			name: "Sales Report",
			link: `sales-report`,
		},
	];

	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data.data);
				setShopName(res.data.data.shopName);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "An error occurred");
				if (err.response?.data)
					axios
						.get(`${server}/seller/logout`, { withCredentials: true })
						.then(() => navigate("/seller/login"));
			});
	}, []);

	return (
		<>
			<main className="vw-100">
				<SellerNavbar shopName={shopName} />
				<div className="w-100 container container-xxl">
					<section className="row py-5">
						<AsideComp asideItems={asideItems} />
						<section className="col col-lg-9">
							<Routes>
								<Route
									path="/all-products"
									element={<SellerAllProducts shopId={data._id} />}
								/>
								<Route
									path="/new-product"
									element={
										<SellerAddProductPage
											shopId={data._id}
											shopName={data.shopName}
										/>
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
								<Route
									path="/new-coupon"
									element={<SellerAddCouponPage shopId={data._id} />}
								/>
								<Route path="/coupons" element={<SellerAllCouponsPage />} />
								<Route
									path="/coupons/:couponId"
									element={<SellerEditCouponPage />}
								/>
								<Route
									path="/messages"
									element={<SellerConversationsPage shopId={data._id} />}
								/>
								<Route
									path="/new-event"
									element={<SellerNewEvent shopId={data._id} />}
								/>
								<Route path="/events" element={<AllEventsSeller />} />
								<Route
									path="/events/:eventId"
									element={<EditSingleEventSeller />}
								/>
								<Route
									path="/edit-single-product/:productId"
									element={<SellerEditSingleProductPage />}
								/>
								<Route path="/wallet" element={<SellerWalletPage />} />
								<Route path="/sales" element={<ChartSales />} />
								<Route path="/char-orders" element={<ChartOrders />} />
								<Route path="/chart-products" element={<ChartProducts />} />
								<Route path="/sales-report" element={<SalesReport />} />
								<Route path="/" element={<MainDashBoard />} />
							</Routes>
						</section>
					</section>
				</div>
			</main>
		</>
	);
};

export default SellerDashboardPage;
