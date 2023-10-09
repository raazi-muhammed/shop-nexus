import React, { useEffect, useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";
import server from "../../server";
import { Route, Routes, useParams } from "react-router-dom";
import SellerAllProducts from "./SellerAllProducts";
import AsideComp from "../../components/AsideComp";
import SellerAddProductPage from "./SellerAddProductPage";
import SellerDetailsEditPage from "./SellerDetailsEditPage";

const SellerDashboardPage = () => {
	const [data, setData] = useState("");
	let { shopId } = useParams();
	const [shopName, setShopName] = useState("Loading...");
	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details/${shopId}`)
			.then((res) => {
				setData(res.data);
				setShopName(res.data.data.shopName);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<main className="vw-100">
			<SellerNavbar shopName={shopName} />
			<section className="row py-5">
				<div className="col-3 mt-3">
					<AsideComp />
				</div>
				<section className="col-9">
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
						<Route path="/" element={<SellerDetailsEditPage data={data} />} />
					</Routes>
				</section>
			</section>
		</main>
	);
};

export default SellerDashboardPage;
