import React from "react";
import Icons from "../../assets/Icons";
const { plus, minus } = Icons;

const QuantityPicker = ({ quantity, setQuantity }) => {
	return (
		<div
			class="btn-group"
			role="group"
			aria-label="Button group with nested dropdown">
			<button
				type="button"
				disabled={quantity <= 1}
				onClick={() => setQuantity((currentQuantity) => currentQuantity - 1)}
				class="btn btn-sm text-primary btn-light p-0">
				{minus}
			</button>
			<div class="btn-group" role="group">
				<button
					type="button"
					class="btn btn-light btn-sm text-primary dropdown-toggle px-3"
					data-bs-toggle="dropdown"
					aria-expanded="false">
					{quantity}
				</button>
				<ul class="dropdown-menu">
					<li onClick={() => setQuantity(5)}>
						<a class="dropdown-item" href="#">
							5
						</a>
					</li>
					<li onClick={() => setQuantity(10)}>
						<a class="dropdown-item" href="#">
							10
						</a>
					</li>
				</ul>
			</div>
			<button
				onClick={() => setQuantity((currentQuantity) => currentQuantity + 1)}
				type="button"
				class="btn btn-sm text-primary btn-light p-0">
				{plus}
			</button>
		</div>
	);
};

export default QuantityPicker;
