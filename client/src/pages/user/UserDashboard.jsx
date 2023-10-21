import React, { useEffect, useState } from "react";
import AsideComp from "../../components/AsideComp";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserEditPage from "./dashboard/UserEditPage";
import UserAddAddress from "./dashboard/userAddAddress";
import UserAllAddress from "./dashboard/UserAllAddress";
import UserAllOrders from "./dashboard/UserAllOrders";
import UserSingleOrderDetails from "./dashboard/UserSingleOrderDetails";
import ChattingComp from "../../components/ChattingComp";
import UserConversationsPage from "./dashboard/UserConversationsPage";

const UserDashboard = () => {
	const navigate = useNavigate();

	const asideItems = [
		{ name: "Edit User", link: "" },
		{ name: "Add Address", link: "add-address" },
		{ name: "Addresses", link: "address" },
		{ name: "Orders", link: "orders" },
		{ name: "Messages", link: "messages" },
	];

	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row py-5">
					<section className="col-12 col-md-4 col-lg-3 mb-5">
						<AsideComp asideItems={asideItems} />
					</section>
					<section className="col-12 col-md-8 col-lg-9">
						<Routes>
							<Route path="/add-address" element={<UserAddAddress />} />
							<Route path="/address" element={<UserAllAddress />} />
							<Route path="/orders" element={<UserAllOrders />} />
							<Route path="/messages" element={<UserConversationsPage />} />
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
