import React, { useEffect, useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";
import server from "../../server";
import { useParams } from "react-router-dom";

const SellerDashboardPage = () => {
	const [data, setData] = useState("");
	let { shopId } = useParams();

	useEffect(() => {
		axios.get(`${server}/seller/get-shop-details/${shopId}`).then((res) => {
			setData(res.data);
		});
	}, []);
	return (
		<main className="vw-100">
			<SellerNavbar />
			<section>
				<p>{JSON.stringify(data)}</p>
			</section>
		</main>
	);
};

export default SellerDashboardPage;
