import React, { useEffect, useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";
import server from "../../server";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import SellerAllProducts from "./SellerAllProducts";
import AsideComp from "../../components/AsideComp";
import SellerAddProductPage from "./SellerAddProductPage";
import SellerDetailsEditPage from "./SellerDetailsEditPage";
import SellerEditSingleProductPage from "./SellerEditSingleProductPage";
import toast from "react-hot-toast";

const SellerDashboardPage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState("");
	let { shopId } = useParams();
	const [shopName, setShopName] = useState("Loading...");

	const asideItems = [
		{
			name: "All Products",
			link: `/seller/dashboard/${shopId}/all-products`,
		},
		{
			name: "New Product",
			link: `/seller/dashboard/${shopId}/new-product`,
		},
		{
			name: "Edit Shop",
			link: `/seller/dashboard/${shopId}/edit-shop`,
		},
	];

	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data);
				setShopName(res.data.data.shopName);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleLogOut = () => {
		axios
			.get(`${server}/seller/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/seller/login");
				window.location.reload();
			});
	};

	return (
		<main className="vw-100">
			<SellerNavbar shopName={shopName} />
			<section className="row py-5">
				<div className="col-3 mt-3">
					<AsideComp asideItems={asideItems} />
					<button
						className="btn btn-sm btn-danger w-100 ms-3"
						onClick={handleLogOut}>
						Log out
					</button>
				</div>
				<section className="col-8 mx-auto">
					<Routes>
						<Route
							path="/all-products"
							element={<SellerAllProducts shopId={shopId} />}
						/>
						<Route
							path="/new-product"
							element={
								<SellerAddProductPage shopId={shopId} shopName={shopName} />
							}
						/>
						<Route path="/edit-shop" element={<SellerDetailsEditPage />} />
						<Route
							path="/edit-single-product/:productId"
							element={<SellerEditSingleProductPage />}
						/>
					</Routes>
				</section>
			</section>
		</main>
	);
};

export default SellerDashboardPage;
