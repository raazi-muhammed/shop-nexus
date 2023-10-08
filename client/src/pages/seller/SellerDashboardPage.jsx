import React, { useEffect, useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";
import server from "../../server";
import { useParams } from "react-router-dom";
import SellerAllProducts from "./SellerAllProducts";

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
			<section>
				<p>{JSON.stringify(data)}</p>
				<SellerAllProducts shopId={shopId} />
			</section>
		</main>
	);
};

export default SellerDashboardPage;
