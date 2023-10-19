import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import AsideComp from "../../components/AsideComp";
import AdminUserPage from "./AdminUserPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./AdminProductsPage";
import AdminProductEditPage from "./AdminProductEditPage";
import AdminSellerPage from "./AdminSellerPage";
import AdminOrdersPage from "./AdminOrdersPage";
import SingleOrderDetails from "./SingleOrderDetails";
import AdminCouponsPage from "./AdminCouponPage";

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
		{ name: "Users", link: "users" },
		{ name: "Sellers", link: "sellers" },
		{ name: "Products", link: "products" },
		{ name: "Orders", link: "orders" },
		{ name: "Coupons", link: "coupons" },
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
				<nav style={{ height: "2rem" }}>
					<p className="h3 mb-1 m-4 ">Admin Page</p>
				</nav>
			</div>
			<div className="container container-xxl">
				<main className="row p-3">
					<section className="mt-3 col-3">
						<AsideComp asideItems={asideItems} />
						<button
							className="btn btn-sm btn-danger w-100"
							onClick={handleLogOut}>
							Log out
						</button>
					</section>
					<section className="col-9">
						<Routes>
							<Route path="/users" element={<AdminUserPage />} />
							<Route path="/sellers" element={<AdminSellerPage />} />
							<Route path="/products" element={<AdminProductsPage />} />
							<Route path="/orders" element={<AdminOrdersPage />} />
							<Route path="/orders/:orderId" element={<SingleOrderDetails />} />
							<Route
								path="/edit-product/:productId"
								element={<AdminProductEditPage />}
							/>
							<Route path="/coupons" element={<AdminCouponsPage />} />
						</Routes>
					</section>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboardPage;
