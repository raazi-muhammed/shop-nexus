import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

import AdminUserPage from "./userAndSellerManagment/AdminUserPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./products/AdminProductsPage";
import AdminProductEditPage from "./products/AdminProductEditPage";
import AdminSellerPage from "./userAndSellerManagment/AdminSellerPage";
import AdminOrdersPage from "./orders/AdminOrdersPage";
import AdminSingleOrderDetails from "./orders/SingleOrderDetails";

import AsideComp from "../../components/layout/AsideComp";
import AdminMainDashBoard from "./dashboard/AdminMainDashboard";
import AdminChartSales from "./dashboard/AdminChartSales";
import AdminChartOrders from "./dashboard/AdminChartOrders";
import AdminSalesReport from "./dashboard/AdminSalesReport";
import AdminCouponsPage from "./coupon/AdminCouponPage";
import AdminEventsPage from "./event/AdminEventsPage";

const AdminDashboardPage = () => {
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-users`, { withCredentials: true })
			.then((res) => setData(res.data.userDetails))
			.catch((err) => toast.error(err.response.data.message));
	}, [refresh]);

	const handleDelete = (id, action) => {
		console.log(id);
		setRefresh(!refresh);
		axios
			.post(`${server}/admin/block-user`, { id, action })
			.then((res) => {
				toast.success(res.data.message);
				toast.error("Refresh if changes are not seen");
			})
			.catch((err) => console.log(err));
	};
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
			name: "Orders",
			link: `char-orders`,
		},
		{
			name: "Sales Report",
			link: `sales-report`,
		},
		{
			name: "User & Seller",
			heading: true,
		},
		{ name: "Users", link: "users" },
		{ name: "Sellers", link: "sellers" },
		{
			name: "Products & Orders & Coupons",
			heading: true,
		},
		{ name: "Products", link: "products" },
		{ name: "Orders", link: "orders" },
		{ name: "Coupons", link: "coupons" },
		{ name: "Events", link: "events" },
	];

	const handleLogOut = () => {
		axios
			.get(`${server}/admin/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/admin/login");
				window.location.reload();
			});
	};
	return (
		<div className="vw-100">
			<div className="container container-xxl">
				<nav
					style={{ height: "2rem" }}
					className="d-flex justify-content-between">
					<p className="h3 mb-1 m-4 ">Admin Page</p>
					<button
						className="btn btn-sm bg-danger-subtle text-danger mt-4"
						onClick={handleLogOut}>
						Log out
					</button>
				</nav>
			</div>
			<div className="container container-xxl">
				<main className="row py-5">
					<AsideComp asideItems={asideItems} />
					<section className="col col-lg-9">
						<Routes>
							<Route path="/users" element={<AdminUserPage />} />
							<Route path="/sellers" element={<AdminSellerPage />} />
							<Route path="/products" element={<AdminProductsPage />} />
							<Route path="/orders" element={<AdminOrdersPage />} />
							<Route
								path="/orders/:orderId"
								element={<AdminSingleOrderDetails />}
							/>
							<Route
								path="/edit-product/:productId"
								element={<AdminProductEditPage />}
							/>
							<Route path="/coupons" element={<AdminCouponsPage />} />
							<Route path="/events" element={<AdminEventsPage />} />
							<Route path="/char-orders" element={<AdminChartOrders />} />
							<Route path="/sales" element={<AdminChartSales />} />
							<Route path="/sales-report" element={<AdminSalesReport />} />
							<Route path="/" element={<AdminMainDashBoard />} />
						</Routes>
					</section>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboardPage;
