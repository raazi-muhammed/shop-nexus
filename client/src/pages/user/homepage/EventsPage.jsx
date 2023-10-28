import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import Icons from "../../../assets/Icons";
import { Link } from "react-router-dom";
const { heart, cart } = Icons;

const EventsPage = () => {
	const [events, setEvents] = useState([]);
	useEffect(() => {
		axios
			.get(`${server}/event/all-events`)
			.then((res) => {
				console.log(res);
				setEvents(res.data?.eventsData);
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl  ">
				{events.map((event) => (
					<article
						className="rounded-5 mb-5 d-flex p-0 align-items-end justify-content-between "
						style={{
							backgroundImage: `url(${event?.images[0]?.url})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							aspectRatio: "18/9",
						}}>
						<div
							style={{
								backgroundImage:
									"linear-gradient(rgba(255, 255, 255, 0), white)",
								backdropFilter: "blur(7px)",
								"-webkit-backdrop-filter": "blur(7px)",
							}}
							className="m-0 p-4 rounded-bottom-5 d-flex justify-content-between align-items-end w-100">
							<section className="col-7">
								<p className="h1 fw-bold text-secondary">{event.name}</p>
								<p className="text-small m-0">{event.description}</p>
								<Link to={event._id}>
									<button className="btn btn-sm p-0 text-secondary fw-bold">
										Learn More
									</button>
								</Link>
							</section>
							<section className="d-flex justify-content-end col">
								<button className="btn btn-sm btn-primary me-2 text-nowrap px-3">
									{cart} Add to Cart
								</button>
								<button className="btn btn-sm btn-light text-primary text-nowrap ">
									{heart} Add to Wishlist
								</button>
							</section>
						</div>
					</article>
				))}
			</div>
		</main>
	);
};

export default EventsPage;
