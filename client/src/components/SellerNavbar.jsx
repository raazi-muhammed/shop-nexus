import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const SellerNavbar = ({ shopName }) => {
	let { shopId } = useParams();
	return (
		<section className="d-flex justify-content-between p-2 bg-light">
			<div>
				<Link to={"/"} className="text-decoration-none text-primary h3">
					Shop Nexus
				</Link>
			</div>

			<section className="d-flex gap-3">
				<button className="btn btn-sm btn-secondary text-white">
					{shopId}
				</button>
				<button className="btn btn-sm btn-secondary text-white">
					{shopName}
				</button>
				{/* <Link to="/login"> */}
			</section>
		</section>
	);
};

export default SellerNavbar;
