import React from "react";
import Icons from "../../assets/Icons";
import { Link } from "react-router-dom";
import { getCategoryByKey } from "../../constants/categoriesConstants";

const { eye, edit } = Icons;

const SellerEventCardProduct = ({
	id,
	name,
	stock,
	category,
	price,
	imgUrl,
	shopId,
}) => {
	return (
		<div className="w-100 ps-0 p-3 m-1 row rounded-4 align-items-center">
			<section className="col d-flex align-items-center ">
				<img
					className="rounded-2"
					style={{ width: "5rem", height: "5rem" }}
					src={imgUrl}
					alt=""
					srcSet=""
				/>
				<div className="ms-2 align-items-center">
					<p className="m-0">{name}</p>
					<p className="text-small m-0">{getCategoryByKey(category)}</p>
					<p className="text-small fw-bold col-2">{`$${price}`}</p>
				</div>
			</section>
			<section className="d-flex align-items-center justify-content-end  col-1 gap-3 ">
				<Link to={`/product/${id}`}>
					<button className="btn btn-secondary text-white btn-sm">{eye}</button>
				</Link>
			</section>
		</div>
	);
};

export default SellerEventCardProduct;
