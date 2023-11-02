import React, { useEffect, useState } from "react";
import Icons from "../../../assets/Icons";
import axios from "axios";
import toast from "react-hot-toast";
import server from "../../../server";
import DashboardCard from "../../../components/seller/DashboardCard";
import formatPrice from "../../../utils/formatPrice";
import ClipLoader from "react-spinners/ClipLoader";
const { cartFill, calender, archiveFill, piggyBankFill, message } = Icons;

const MainDashBoard = () => {
	const [refresh, setRefresh] = useState(true);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/dashboard`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
				const data = res.data.data;
				setData(data);
			})
			.catch((err) =>
				toast.error(err.response?.data?.message || "An error occurred")
			)
			.finally(() => {
				setLoading(false);
			});
	}, [refresh]);

	return (
		<main className="px-4">
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
					<p className="mt-4 text-secondary mb-1">Last 7 Days</p>
					<section>
						<section className="row gap-4">
							<DashboardCard
								icon={archiveFill}
								heading={"Orders"}
								value={data?.sevenDays?.orders || 0}
								valueBefore={data?.previousSevenDays?.orders || 0}
							/>
							<DashboardCard
								icon={piggyBankFill}
								heading={"Revenue"}
								value={data?.sevenDays?.revenue || 0}
								valueBefore={data?.previousSevenDays?.revenue || 0}
								formatMoney={true}
							/>
							<DashboardCard
								icon={cartFill}
								heading={"Delivered"}
								value={data?.sevenDays?.delivered || 0}
								valueBefore={data?.previousSevenDays?.delivered || 0}
							/>
						</section>
					</section>
					<p className="mt-4 text-secondary mb-1">Last 30 Days</p>
					<section>
						<section className="row gap-4">
							<DashboardCard
								icon={archiveFill}
								heading={"Orders"}
								value={data?.thirtyDays?.orders || 0}
								valueBefore={data?.previousThirtyDays?.orders || 0}
							/>
							<DashboardCard
								icon={piggyBankFill}
								heading={"Revenue"}
								value={data?.thirtyDays?.revenue || 0}
								valueBefore={data?.previousThirtyDays?.revenue || 0}
								formatMoney={true}
							/>
							<DashboardCard
								icon={cartFill}
								heading={"Delivered"}
								value={data?.thirtyDays?.delivered || 0}
								valueBefore={data?.previousThirtyDays?.delivered || 0}
							/>
						</section>
					</section>
				</>
			)}
		</main>
	);
};

export default MainDashBoard;
