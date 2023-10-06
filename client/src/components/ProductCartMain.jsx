import React from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart } = Icons;

const ProductCartMain = ({
	name,
	sold,
	price,
	rating,
	discount_price,
	imgUrl,
	shopName,
}) => {
	return (
		<section
			className="bg-white d-flex flex-column m-3 rounded-4 flex-shrink-0"
			style={({ "min-width": "15rem" }, { "max-width": "18rem" })}>
			<img className="rounded-4 w-100 " src={imgUrl} alt="" srcSet="" />
			<section className="d-flex flex-column p-4 pb-0 ">
				<Link className="text-secondary text-small text-decoration-none">
					{shopName}
				</Link>
				<p>{name}</p>
				<section className="d-flex gap-2">
					<p className="text-small">Rating: {rating}</p>
					<p className="text-small">{sold} Sold</p>
				</section>
				<section className="d-flex gap-1 ">
					<p className="h4 mb-0">${discount_price}</p>
					<p className="text-small text-decoration-line-through">${price}</p>
				</section>
			</section>
			<section className="m-2 d-flex gap-2">
				<button className="btn btn-sm btn-primary flex-grow-1 d-flex gap-2 align-items-center">
					{cart} Add to Cart
				</button>
				<button className="btn btn-sm btn-secondary text-white">{heart}</button>
			</section>
		</section>
	);
};

export default ProductCartMain;
