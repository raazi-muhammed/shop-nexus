import React from "react";

const OrderItemsInOrder = ({ orderItems }) => {
	return (
		<>
			{orderItems?.map((product, i) => (
				<div key={i} className="row my-3">
					<div className="col-3 my-auto ">
						<img
							className="w-100 rounded-3"
							src={product.product?.images[0].url || ""}
							alt=""
						/>
					</div>
					<div className="col my-auto">
						<p className="text-primary fw-bold m-0">{product.product.name}</p>
						<p className="text-small m-0">{product.product.shop.name}</p>
						<p>
							{product.price / product.quantity} ×{" "}
							<span>{product.quantity}</span>
						</p>
					</div>
				</div>
			))}
		</>
	);
};

export default OrderItemsInOrder;
