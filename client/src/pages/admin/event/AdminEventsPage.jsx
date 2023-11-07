import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import { useParams } from "react-router-dom";
import Sorting from "../../../components/Sorting";
import Pagination from "../../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import RefreshButton from "../../../components/RefreshButton";
import EventCartMain from "../../../components/events/EventCartMain";
import EventCartAdmin from "../../../components/events/EventCartAdmin";

const AdminEventsPage = () => {
	const { shopId } = useParams();
	const [eventsData, setEventsData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "createdAt", title: "Date" },
			{ value: "type_of_event", title: "Event Type" },
			{ value: "discount_percentage", title: "Discount Percentage" },
			{ value: "start_date", title: "Start Date" },
			{ value: "end_date", title: "End Date" },
		],
	});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/admin/get-all-events?page=${pagination.page || 1}&sort=${
					sortOptions.sortBy
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				console.log(res);
				setEventsData(res.data?.eventsData);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}, [refresh, pagination.page, sortOptions]);
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
					<section className="d-flex justify-content-end gap-3 ">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<Sorting
							sortOptions={sortOptions}
							setSortOptions={setSortOptions}
						/>
						<Pagination pagination={pagination} setPagination={setPagination} />
					</section>
					{eventsData?.length === 0 && (
						<p className="text-secondary">There aren't any orders</p>
					)}
					<section className="d-flex flex-column gap-2">
						{eventsData.map((event) => (
							<>
								{new Date(event.end_date) >= new Date() &&
									event.isDeleted === false && (
										<EventCartAdmin key={event._id} event={event} />
									)}
							</>
						))}
						{!loading && (
							<p className="fw-bold m-3 text-danger">Expired or Deleted</p>
						)}
						{eventsData.map((event) => (
							<>
								{(new Date(event.end_date) < new Date() || event.isDeleted) && (
									<EventCartAdmin key={event._id} event={event} />
								)}
							</>
						))}
					</section>
				</>
			)}
		</div>
	);
};

export default AdminEventsPage;
