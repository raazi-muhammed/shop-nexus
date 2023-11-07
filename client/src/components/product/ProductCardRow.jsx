import React from "react";
import Icons from "../../assets/Icons";
import { Link } from "react-router-dom";
import { getCategoryByKey } from "../../constants/categoriesConstants";
import formatPrice from "../../utils/formatPrice";

const { eye, edit } = Icons;

const ProductCardRow = ({
	id,
	name,
	stock,
	category,
	price,
	imgUrl,
	shopId,
}) => {
	return (
		<div className="ps-0 p-3 bg-white m-1 row rounded-4 align-items-center">
			<section className="col-6 d-flex align-items-center ">
				<img
					className="rounded-2"
					style={{ width: "5rem", height: "5rem" }}
					src={imgUrl}
					alt=""
					srcSet=""
				/>
				<div className="ms-2 align-items-center">
					<p className="text-small m-0">{`Id: ${id}`}</p>
					<p className="m-0">{name}</p>
				</div>
			</section>
			<section className="col-3">
				<p className="m-0">{getCategoryByKey(category)}</p>
				<p className="fw-bold">{`${stock} in Stock`}</p>
			</section>
			<p className="col-2">{formatPrice(price)}</p>
			<section className="d-flex align-items-center justify-content-end  col-1 gap-3 ">
				<Link to={`/product/${id}`}>
					<button className="btn btn-secondary text-white btn-sm">{eye}</button>
				</Link>
				<Link to={`/seller/dashboard/edit-single-product/${id}`}>
					<button className="btn btn-secondary text-white btn-sm">
						{edit}
					</button>
				</Link>
			</section>
		</div>
	);
};

export default ProductCardRow;
