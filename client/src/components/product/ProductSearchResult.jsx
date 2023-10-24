import React from "react";
import { Link } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import RatingStar from "./RatingStar";

const ProductSearchResult = ({ productDetails }) => {
	return (
		<div className="col pb-2">
			<section className="h-100 bg-white d-flex flex-column rounded-4">
				<Link
					className="text-decoration-none row"
					to={`/product/${productDetails._id}`}>
					<div className="col-3 d-flex">
						<img
							className="rounded-4 w-100 my-auto"
							src={productDetails.images[0].url}
							alt=""
							style={{ width: "4rem" }}
						/>
					</div>
					<section className="col d-flex flex-column p-4 justify-content-center gap-2">
						<p className="m-0">{productDetails.name}</p>
						<p
							className="text-small text-primary m-0"
							style={{
								width: "70%",
								height: "2rem",
								"line-height": "1.5em",
								overflow: "hidden",
								"text-overflow": "ellipsis",
							}}>
							{productDetails.description}
						</p>
						<section className="d-flex gap-2">
							<RatingStar rating={productDetails.rating} />
							<p className="text-small mt-2 m-0">{`${productDetails.total_sell} Sold`}</p>
						</section>
						<section className="d-flex gap-1 ">
							<p className="h4 mb-0">
								{formatPrice(productDetails.discount_price)}
							</p>
							<p className="text-small text-decoration-line-through">
								{formatPrice(productDetails.price)}
							</p>
						</section>
					</section>
				</Link>
			</section>
		</div>
	);
};

export default ProductSearchResult;
