import React, { useEffect, useState } from "react";
import AsideComp from "../../components/AsideComp";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserEditPage from "./UserEditPage";
import UserAddAddress from "./userAddAddress";
import UserAllAddress from "./UserAllAddress";

const UserDashboard = () => {
	const navigate = useNavigate();

	const asideItems = [
		{ name: "Edit User", link: "" },
		{ name: "Add Address", link: "add-address" },
		{ name: "Addresses", link: "address" },
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
		<main className="vw-100 min-vh-100 row p-2">
			<section className="col-3">
				<AsideComp asideItems={asideItems} />
				<button
					className="btn btn-sm btn-danger w-100 ms-3"
					onClick={handleLogOut}>
					Log out
				</button>
			</section>
			<section className="col-9 px-4 py-3 ">
				<Routes>
					<Route path="/add-address" element={<UserAddAddress />} />
					<Route path="/address" element={<UserAllAddress />} />
					<Route path="/" element={<UserEditPage />} />
				</Routes>
			</section>
		</main>
	);
};

export default UserDashboard;
