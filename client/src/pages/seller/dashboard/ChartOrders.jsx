import React, { useEffect, useState } from "react";
import BarChart from "../../../components/charts/BarChart";
import server from "../../../server";
import axios from "axios";
import convertISOToDate from "../../../utils/convertISOToDate";
import normalDateFormatter from "../../../utils/normalDateFormatter";
import RefreshButton from "../../../components/RefreshButton";
import ClipLoader from "react-spinners/ClipLoader";
import DateRangerDropDown from "../../../components/charts/DateRangerDropDown";
import CategorySelector from "../../../components/charts/CategorySelector";
import toast from "react-hot-toast";

const ChartOrders = () => {
	const [chartData, setChartData] = useState();
	const [refresh, setRefresh] = useState(true);
	const [loading, setLoading] = useState(false);
	const [categorizeBy, setCategorizeBy] = useState("MONTH");
	const categoryOptions = [
		{
			key: "DAY",
			value: "Day",
		},
		{
			key: "MONTH",
			value: "Month",
		},
		{
			key: "YEAR",
			value: "Year",
		},
	];
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/chart/orders?categorizeBy=${categorizeBy}&startDate=${startDate}&endDate=${endDate}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const data = res.data.chartData;
				setChartData({
					labels: data.map((row) => row._id),
					datasets: [
						{
							label: "Total Revenue",
							data: data.map((row) => row.count),
						},
					],
				});
			})
			.catch((err) =>
				toast.error(err.response?.data?.message || "An error occurred")
			)
			.finally(() => setLoading(false));
	}, [categorizeBy, refresh]);

	return (
		<div>
			{loading ? (
				<div className="min-vh-100 w-100 d-flex justify-content-center ">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<section className="d-flex justify-content-end gap-3 ms-auto mb-4">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<DateRangerDropDown
							setRefresh={setRefresh}
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
						/>
						<CategorySelector
							categorizeBy={categorizeBy}
							setCategorizeBy={setCategorizeBy}
							categoryOptions={categoryOptions}
						/>
					</section>
					<div className="h-100">
						{chartData && <BarChart chartData={chartData} />}
					</div>
				</>
			)}
		</div>
	);
};

export default ChartOrders;
