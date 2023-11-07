import React from "react";
import { Link } from "react-router-dom";
import formatPrice from "../../../utils/formatPrice";

const PriceDetails = ({ grossPrice, shippingCharge, totalAmount }) => {
	return (
		<div>
			<p className="text-light text-small mt-4 mb-1">Price Details</p>
			<div className="row">
				<div className="col-12 d-flex">
					<p className="col text-secondary">Gross Price</p>
					<p className="col-3 mt-auto text-end text-secondary">
						{formatPrice(grossPrice)}
					</p>
				</div>
				<div className="col-12 d-flex">
					<p className="mb-0 col text-secondary">Shipping Charge</p>
					<p className="mb-0 col-3 mt-auto text-end text-secondary">
						{shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
					</p>
				</div>
				<Link to={"/shop-nexus-plus"} className="text-small text-light mb-2">
					Get Free shipping
				</Link>
				<div className="col-12 d-flex">
					<p className="col text-secondary">Discount</p>
					<p className="col-3 mt-auto text-end text-secondary text-nowrap">
						-{formatPrice(grossPrice - totalAmount)}
					</p>
				</div>
				<hr className="text-secondary" />
				<div className="col-12 d-flex">
					<p className="col text-primary fw-bold m-0">Discounted Amount</p>
					<p className="col-3 mt-auto text-end text-primary fw-bold m-0">
						{formatPrice(totalAmount)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default PriceDetails;
