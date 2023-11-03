import React, { useEffect, useState } from "react";

import Icons from "../../assets/Icons";
const { star, hollowStar, halfStar } = Icons;

const RatingStarInput = ({ rating, setRating }) => {
	const [starArray, setStarArray] = useState([]);
	useEffect(() => {
		const newArray = [];
		let lastStart = 0;
		for (let i = 0; i < 10; i += 2) {
			if (i < rating) {
				lastStart = i;
				newArray.push(star);
			} else newArray.push(hollowStar);
		}
		if (rating % 2 != 0) newArray[lastStart / 2] = halfStar;
		setStarArray(newArray);
	}, [rating]);

	return (
		<div className="d-flex gap-1 m-0 p-0">
			{starArray.map((icon, i) => (
				<div
					onClick={() => setRating(i * 2 + 2)}
					key={i}
					className="text-secondary m-0 p-0">
					{icon}
				</div>
			))}
		</div>
	);
};

RatingStarInput.defaultProps = {
	rating: 0,
};

export default RatingStarInput;
