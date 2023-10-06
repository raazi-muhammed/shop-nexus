import React from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;
const UserNavbar = () => {
	return (
		<section className="d-flex justify-content-between p-2 bg-light">
			<div>
				<button className="btn btn-sm btn-secondary text-white">
					Catergories
				</button>
			</div>
			<nav className="d-flex gap-3">
				<Link to="/home">
					<button className="btn btn-sm btn-secondary text-white">Home</button>
				</Link>
				<Link>
					<button className="btn btn-sm text-secondary">Best Selling</button>
				</Link>
				<Link to="/new-products">
					<button className="btn btn-sm text-secondary">Products</button>
				</Link>
				<Link>
					<button className="btn btn-sm text-secondary">Events</button>
				</Link>
				<Link to="/faqs">
					<button className="btn btn-sm text-secondary">FAQs</button>
				</Link>
			</nav>
			<section className="d-flex gap-3">
				<button className="btn btn-sm btn-secondary text-white">{heart}</button>
				<button className="btn btn-sm btn-secondary text-white">{cart}</button>
				<Link to="/login">
					<button className="btn btn-sm btn-secondary text-white">
						{profile}
					</button>
				</Link>
			</section>
		</section>
	);
};

export default UserNavbar;
