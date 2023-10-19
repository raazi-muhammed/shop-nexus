import React, { useEffect, useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";
import server from "../../server";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import SellerAllProducts from "./SellerAllProducts";
import AsideComp from "../../components/AsideComp";
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

const SellerDashboardPage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState("");
	let { shopId } = useParams();
	const [shopName, setShopName] = useState("Loading...");

	const asideItems = [
		{
			name: "All Products",
			link: `/seller/dashboard/${shopId}/all-products`,
		},
		{
			name: "New Product",
			link: `/seller/dashboard/${shopId}/new-product`,
		},
		{
			name: "Stock Management",
			link: `/seller/dashboard/${shopId}/stock-management`,
		},
		{
			name: "Edit Shop",
			link: `/seller/dashboard/${shopId}/edit-shop`,
		},
		{
			name: "All Orders",
			link: `/seller/dashboard/${shopId}/orders`,
		},
		{
			name: "New Coupon",
			link: `/seller/dashboard/${shopId}/new-coupon`,
		},
		{
			name: "All Coupons",
			link: `/seller/dashboard/${shopId}/coupons`,
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
					<div className="col-3 mt-3">
						<AsideComp asideItems={asideItems} />
					</div>
					<section className="col-9 mx-auto">
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
