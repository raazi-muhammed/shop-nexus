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
		<main className="vw-100 min-vh-100 p-2">
			<div className="w-100 container container-xxl  ">
				<div className="row">
					<section className="col-12 col-md-4 col-lg-3">
						<AsideComp asideItems={asideItems} />
						<button
							className="btn btn-sm btn-danger w-100"
							onClick={handleLogOut}>
							Log out
						</button>
					</section>
					<section className="col px-4 py-3 ">
						<Routes>
							<Route path="/add-address" element={<UserAddAddress />} />
							<Route path="/address" element={<UserAllAddress />} />
							<Route path="/" element={<UserEditPage />} />
						</Routes>
					</section>
				</div>
			</div>
		</main>
	);
};

export default UserDashboard;
