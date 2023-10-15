import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
	return (
		<div>
			<p>Payment Successful</p>
			<Link to={"/"}>Go Home</Link>
		</div>
	);
};

export default SuccessPage;
