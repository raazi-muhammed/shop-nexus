import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const SuccessPlus = () => {
	return (
		<div className="text-center h-100">
			<div>
				<p className="display-4 fw-bold text-primary mt-5 pt-5">
					You are now a Plus Member
				</p>
				<Link to={"/"}>
					<button className="btn btn-secondary px-3 btn-sm rounded-pill text-white mb-2 ">
						Browse Other Products
					</button>
				</Link>
			</div>
		</div>
	);
};

export default SuccessPlus;
