import React, { useEffect, useState } from "react";
import BarChart from "../../../components/charts/BarChart";
import server from "../../../server";
import axios from "axios";

const DashBoard = () => {
	useEffect(() => {
		axios
			.get(`${server}/seller/chart/products-sold`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
				const data = res.data.chartData;
				setUserData({
					labels: data.map((row) => row.name),
					datasets: [
						{
							label: "Total Sales",
							data: data.map((row) => row.total_sell),
							borderColor: "#d7d6f6",
							backgroundColor: "#7a76e2",
							hoverBackgroundColor: "#342475",
							borderWidth: 2,
							borderRadius: 10,
						},
					],
				});
			})
			.catch((err) => console.log(err));
	}, []);

	const data = [
		{ year: 2010, count: 10 },
		{ year: 2011, count: 20 },
		{ year: 2012, count: 15 },
		{ year: 2013, count: 25 },
		{ year: 2014, count: 22 },
		{ year: 2015, count: 30 },
		{ year: 2016, count: 28 },
	];

	const [userData, setUserData] = useState({
		labels: data.map((row) => row.year),
		datasets: [
			{
				label: "Acquisitions by year",
				data: data.map((row) => row.count),
				borderColor: "#d7d6f6",
				backgroundColor: "#7a76e2",
				hoverBackgroundColor: "#342475",
				borderWidth: 2,
				borderRadius: 10,
			},
		],
	});

	return (
		<div>
			<BarChart chartData={userData} />
		</div>
	);
};

export default DashBoard;
