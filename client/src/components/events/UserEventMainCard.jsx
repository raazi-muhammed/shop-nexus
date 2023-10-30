import React from "react";
import { Link } from "react-router-dom";

const UserEventMainCard = ({ event }) => {
	return (
		<article
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
						"linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0),rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9), white)",
				}}
				className="rounded-5 m-0 p-4 d-flex justify-content-start align-items-center h-100 w-100">
				<section className="w-50">
					<p className="h1 w-100 fw-bold text-secondary">{event.name}</p>
					<p
						style={{ height: "4.6rem" }}
						className="w-75 text-small m-0 overflow-hidden">
						{event.description}
					</p>
					<Link to={`/events/${event._id}`}>
						<button className="btn btn-sm p-0 text-secondary fw-bold mb-2">
							Learn More
						</button>
					</Link>
				</section>
			</div>
		</article>
	);
};

export default UserEventMainCard;
