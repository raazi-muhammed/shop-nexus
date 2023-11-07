import React from "react";
import { Link } from "react-router-dom";
import { getTypeOfEventByKey } from "../../constants/typeOfEventConstants";
import convertISOToDate from "../../utils/convertISOToDate";
import Icons from "../../assets/Icons";
const { edit } = Icons;

const EventCartMain = ({ event }) => {
	return (
		<div className="p-3 bg-white m-1 row rounded-4 align-items-center ">
			<section className="col-5">
				<img className="w-50 rounded-3" src={event.images[0].url} alt="" />
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
				<p className="text-small text-secondary m-0">Discount Percentage</p>
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
	);
};

export default EventCartMain;
