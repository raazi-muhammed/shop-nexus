import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import Icons from "../../../assets/Icons";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
const { heart, cart } = Icons;

const EventsPage = () => {
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState([]);
	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/event/all-events`)
			.then((res) => {
				setEvents(res.data?.eventsData);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}, []);
	return (
		<main className="vw-100 min-vh-100 mt-4">
			{loading && (
				<div className="d-flex justify-content-center ">
					<ClipLoader
						className="text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			)}
			<div className="w-100 container container-xxl  ">
				{events.map((event) => (
					<article
						key={event._id}
						className="rounded-5 mb-5 d-flex p-0 align-items-end justify-content-between "
						style={{
							backgroundImage: `url(${event?.images[0]?.url})`,
							backgroundSize: "contain",
							backgroundPosition: "right",
							aspectRatio: "24/9",
						}}>
						<div
							style={{
								backgroundImage:
									"linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9), white)",
							}}
							className="rounded-5 m-0 p-4 d-flex justify-content-start align-items-center h-100 w-100">
							<section className="w-50">
								<p className="h1 w-100 fw-bold text-secondary">{event.name}</p>
								<p className="w-75 text-small m-0">{event.description}</p>
								<Link to={event._id}>
									<button className="btn btn-sm p-0 text-secondary fw-bold mb-2">
										Learn More
									</button>
								</Link>
							</section>
						</div>
					</article>
				))}
			</div>
		</main>
	);
};

export default EventsPage;
