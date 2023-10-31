import React, { useEffect, useState } from "react";

import { Link, Route, Routes, useNavigate } from "react-router-dom";
import UserEditPage from "./dashboard/UserEditPage";
import UserAddAddress from "./dashboard/userAddAddress";
import UserAllAddress from "./dashboard/UserAllAddress";
import UserAllOrders from "./dashboard/UserAllOrders";
import UserSingleOrderDetails from "./dashboard/UserSingleOrderDetails";
import ChattingComp from "../../components/ChattingComp";
import UserConversationsPage from "./dashboard/UserConversationsPage";

import AsideComp from "../../components/layout/AsideComp";

import UserWallet from "./dashboard/UserWallet";
import UserShopNexusPlus from "./dashboard/UserShopNexusPlus";
import { useSelector } from "react-redux";
import PlusSubscriptionDetails from "./dashboard/PlusSubscriptionDetails";

const UserDashboard = () => {
	const userData = useSelector((state) => state.userData.userData);

	const asideItems = [
		{ name: "Edit User", link: "" },
		{ name: "Add Address", link: "add-address" },
		{ name: "Addresses", link: "address" },
		{ name: "Orders", link: "orders" },
		{ name: "Messages", link: "messages" },
		{ name: "Wallet", link: "wallet" },
	];

	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row py-5">
					<section className="col-12 col-md-4 col-lg-3 mb-5">
						<AsideComp asideItems={asideItems} />
						<section className="bg-primary rounded-4 mt-2 text-white p-4">
							{userData.plusMember?.active ? (
								<Link to={"shop-nexus-plus"}>
									<p className="m-0 text-white">Shop Nexus Plus</p>
									<p className="text-small text-secondary m-0">
										View Your Benifits
									</p>
								</Link>
							) : (
								<Link to={"/shop-nexus-plus"}>
									<div>
										<button
											className={
												"btn text-light fw-light text-start w-100 p-0"
											}>
											Become{" "}
											<span className="fw-bold text-white"> Shop Nexus+</span>{" "}
											Member
										</button>
										<p className="text-small text-secondary mb-1">
											Get free shipping
										</p>
										<p className="text-small text-secondary mb-1">
											Message seller directly
										</p>
									</div>
								</Link>
							)}
						</section>
					</section>
					<section className="col-12 col-md-8 col-lg-9">
						<Routes>
							<Route path="/add-address" element={<UserAddAddress />} />
							<Route path="/address" element={<UserAllAddress />} />
							<Route path="/orders" element={<UserAllOrders />} />

							<Route
								path="/messages"
								element={
									userData?.plusMember?.active ? (
										<UserConversationsPage />
									) : (
										<UserShopNexusPlus />
									)
								}
							/>

							<Route path="/wallet" element={<UserWallet />} />
							<Route
								path="/shop-nexus-plus"
								element={<PlusSubscriptionDetails />}
							/>

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
