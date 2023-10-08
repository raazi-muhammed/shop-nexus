import React, { useState } from "react";
import { useParams } from "react-router-dom";

const SellerNavbar = ({ shopName }) => {
	let { shopId } = useParams();
	return (
		<section className="d-flex justify-content-between p-2 bg-light">
			<div>
				<button className="btn btn-sm btn-secondary text-white">
					Catergories
				</button>
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
