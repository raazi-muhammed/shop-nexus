import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import AsideComp from "../../components/AsideComp";
import AdminUserPage from "./AdminUserPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./AdminProductsPage";
import AdminProductEditPage from "./AdminProductEditPage";

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
		{ name: "User", link: "user" },
		{ name: "Products", link: "products" },
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
		<div>
			<nav style={{ height: "2rem" }}>
				<p className="h3 mb-1 m-4 ">Admin Page</p>
			</nav>
			<main className="row vw-100 p-3">
				<section className="col-3">
					<AsideComp asideItems={asideItems} />
					<button
						className="btn btn-sm btn-danger w-100 ms-3"
						onClick={handleLogOut}>
						Log out
					</button>
				</section>
				<section className="ps-5 col">
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
