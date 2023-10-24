import React, { useEffect, useState } from "react";

import Icons from "../../assets/Icons";
const { star, hollowStar } = Icons;

const RatingStar = ({ rating }) => {
	const [starArray, setStarArray] = useState([]);
	useEffect(() => {
		const newArray = [];
		for (let i = 0; i < 5; i++) {
			if (i < rating / 2) newArray.push(star);
			else newArray.push(hollowStar);
		}
		setStarArray(newArray);
	}, [rating]);

	return (
		<div className="d-flex gap-1 ">
			{starArray.map((icon, i) => (
				<div key={i} className="text-secondary">
					{icon}
				</div>
			))}
		</div>
	);
};

RatingStar.defaultProps = {
	rating: 0,
};

export default RatingStar;
