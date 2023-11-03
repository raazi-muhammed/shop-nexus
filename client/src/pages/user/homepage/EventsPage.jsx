import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import Icons from "../../../assets/Icons";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import UserEventMainCard from "../../../components/events/UserEventMainCard";
const { heart, cart } = Icons;

const EventsPage = ({ onHomePage }) => {
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
		<main className="vw-100 mt-4">
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

			<div className="w-100 container container-xxl ">
				{onHomePage ? (
					<div
						id="carouselExample"
						class="carousel slide"
						data-bs-ride="carousel">
						<div style={{ aspectRatio: "24/9" }} class="carousel-inner">
							{events.map((event, i) => (
								<div class={`carousel-item ${i === 1 ? "active" : null}`}>
									<UserEventMainCard key={event._id} event={event} />
								</div>
							))}
						</div>
						<button
							class="carousel-control-prev z-3 h-25 mt-auto w-50"
							type="button"
							data-bs-target="#carouselExample"
							data-bs-slide="prev">
							<span
								class="carousel-control-prev-icon rounded-5 ms-auto mt-auto m-3"
								aria-hidden="true"></span>
							<span class="visually-hidden">Previous</span>
						</button>
						<button
							class="carousel-control-next h-25 mt-auto w-50"
							type="button"
							data-bs-target="#carouselExample"
							data-bs-slide="next">
							<span
								class="carousel-control-next-icon rounded-5 me-auto mt-auto m-3"
								aria-hidden="true"></span>
							<span class="visually-hidden">Next</span>
						</button>
					</div>
				) : (
					<>
						{events.map((event) => (
							<UserEventMainCard key={event._id} event={event} />
						))}
					</>
				)}
			</div>
		</main>
	);
};

EventsPage.defaultProps = {
	onHomePage: false,
};

export default EventsPage;
