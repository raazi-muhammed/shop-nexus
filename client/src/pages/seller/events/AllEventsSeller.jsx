import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";

import Icons from "../../../assets/Icons";
import { Link, useParams } from "react-router-dom";
import convertISOToDate from "../../../utils/convertISOToDate";
import { getTypeOfEventByKey } from "../../../constants/typeOfEventConstants";
import Sorting from "../../../components/Sorting";
import Pagination from "../../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
const { eye, edit } = Icons;

const AllEventsSeller = () => {
	const { shopId } = useParams();
	const [eventsData, setEventsData] = useState([]);
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
				`${server}/seller/get-all-events/${shopId}?page=${
					pagination.page || 1
				}&sort=${sortOptions.sortBy}`,
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
	}, [pagination.page, sortOptions]);
	return (
		<div>
			<section className="d-flex justify-content-end gap-3 ">
				<Sorting sortOptions={sortOptions} setSortOptions={setSortOptions} />
				<Pagination pagination={pagination} setPagination={setPagination} />
			</section>
			{loading && (
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
			)}
			{eventsData?.length === 0 && (
				<p className="text-secondary">There aren't any orders</p>
			)}
			<section className="d-flex flex-column gap-2">
				{eventsData.map((event) => (
					<div
						key={event._id}
						className="p-3 bg-white m-1 row rounded-4 align-items-center ">
						<section className="col-5">
							<img
								className="w-50 rounded-3"
								src={event.images[0].url}
								alt=""
							/>
							<p className="mt-2 mb-0">{event.name}</p>
						</section>
						<section className="col-3">
							<p className="text-small text-secondary m-0">Start Date</p>
							<p>{convertISOToDate(event.start_date)}</p>
							<p className="text-small text-secondary m-0">End Date</p>
							<p className="m-0">{convertISOToDate(event.end_date)}</p>
						</section>
						<section className="col-3">
							<p className="text-small text-secondary m-0">Type of event</p>
							<p>{getTypeOfEventByKey(event.type_of_event)}</p>
							<p className="text-small text-secondary m-0">
								Discount Percentage
							</p>
							<p className="mb-0">{event.discount_percentage * 100}%</p>
						</section>
						<section className="d-flex align-items-center justify-content-end  col-1 gap-3 ">
							<Link to={`${event._id}`}>
								<button className="btn btn-secondary text-white btn-sm">
									{edit}
								</button>
							</Link>
						</section>
					</div>
				))}
			</section>
		</div>
	);
};

export default AllEventsSeller;
