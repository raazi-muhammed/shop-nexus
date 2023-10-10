import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import AsideComp from "../../components/AsideComp";
import AdminUserPage from "./AdminUserPage";
import { Route, Routes } from "react-router-dom";
import AdminProductsPage from "./AdminProductsPage";
import AdminProductEditPage from "./AdminProductEditPage";

const AdminDashboardPage = () => {
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-users`)
			.then((res) => setData(res.data.userDetails));
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
		{ name: "User", link: "user" },
		{ name: "Products", link: "products" },
	];
	return (
		<div>
			<nav style={{ height: "2rem" }}>
				<p className="h3 mb-1 m-4 ">Admin Page</p>
			</nav>
			<main className="row gap-3 vw-100">
				<section className="col-3">
					<AsideComp asideItems={asideItems} />
				</section>
				<section className="col-8">
					<Routes>
						<Route path="/user" element={<AdminUserPage />} />
						<Route path="/products" element={<AdminProductsPage />} />
						<Route
							path="/edit-product/:productId"
							element={<AdminProductEditPage />}
						/>
					</Routes>
				</section>
			</main>
		</div>
	);
};

export default AdminDashboardPage;
