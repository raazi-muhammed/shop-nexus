import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import UserEditPage from "./dashboard/UserEditPage";
import UserAddAddress from "./dashboard/userAddAddress";
import UserAllAddress from "./dashboard/UserAllAddress";
import UserAllOrders from "./dashboard/UserAllOrders";
import UserSingleOrderDetails from "./dashboard/UserSingleOrderDetails";
import UserConversationsPage from "./dashboard/UserConversationsPage";
import AsideComp from "../../components/layout/AsideComp";
import UserWallet from "./dashboard/UserWallet";
import UserShopNexusPlus from "./dashboard/UserShopNexusPlus";
import { useSelector } from "react-redux";
import PlusSubscriptionDetails from "./dashboard/PlusSubscriptionDetails";
import UserReferral from "./referral/UserReferral";

const UserDashboard = () => {
	const userData = useSelector((state) => state.userData.userData);

	const asideItems = [
		{ name: "Edit User", link: "" },
		{ name: "Add Address", link: "add-address" },
		{ name: "Addresses", link: "address" },
		{ name: "Orders", link: "orders" },
		{ name: "Messages", link: "messages" },
		{ name: "Wallet", link: "wallet" },
		{ name: "Nexus Plus", link: "nexus-plus" },
		{ name: "Referral", link: "referral" },
	];

	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row py-5">
					<AsideComp asideItems={asideItems} />
					<section className="col">
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
							<Route
								path="/nexus-plus"
								element={
									<section>
										{userData.plusMember?.active ? (
											<PlusSubscriptionDetails />
										) : (
											<UserShopNexusPlus />
										)}
									</section>
								}
							/>

							<Route path="/wallet" element={<UserWallet />} />
							<Route path="/referral" element={<UserReferral />} />

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
