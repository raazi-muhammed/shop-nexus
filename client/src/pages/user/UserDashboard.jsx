import React, { useEffect, useState } from "react";
import AsideComp from "../../components/AsideComp";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserEditPage from "./dashboard/UserEditPage";
import UserAddAddress from "./dashboard/userAddAddress";
import UserAllAddress from "./dashboard/UserAllAddress";
import UserAllOrders from "./dashboard/UserAllOrders";
import UserSingleOrderDetails from "./dashboard/UserSingleOrderDetails";

const UserDashboard = () => {
	const navigate = useNavigate();

	const asideItems = [
		{ name: "Edit User", link: "" },
		{ name: "Add Address", link: "add-address" },
		{ name: "Addresses", link: "address" },
		{ name: "Orders", link: "orders" },
	];
	const handleLogOut = () => {
		axios
			.get(`${server}/user/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/");
				window.location.reload();
			});
	};

	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row py-5">
					<section className="col-12 col-md-4 col-lg-3">
						<AsideComp asideItems={asideItems} />
						<button
							className="btn btn-sm btn-danger w-100"
							onClick={handleLogOut}>
							Log out
						</button>
					</section>
					<section className="col-12 col-md-8 col-lg-9">
						<Routes>
							<Route path="/add-address" element={<UserAddAddress />} />
							<Route path="/address" element={<UserAllAddress />} />
							<Route path="/orders" element={<UserAllOrders />} />
							<Route
								path="/orders/:orderId"
								element={<UserSingleOrderDetails />}
							/>
							<Route path="/" element={<UserEditPage />} />
						</Routes>
					</section>
				</div>
			</div>
		</main>
	);
};

export default UserDashboard;
