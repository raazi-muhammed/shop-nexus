import React from "react";
import formatPrice from "../../utils/formatPrice";

const DashboardCard = ({ icon, heading, value, valueBefore, formatMoney }) => {
	return (
		<div class="card col border-0">
			<div class="card-body">
				<div className="d-flex align-items-center mb-2">
					<div className="text-secondary me-3" style={{ width: "2rem" }}>
						{icon}
					</div>
					<p class="card-text mb-0 text-secondary">{heading}</p>
				</div>

				<p class="display-6 text-nowrap overflow-ellipsis  card-title text-primary mb-0">
					{formatMoney ? formatPrice(value) : value}
				</p>
				<p
					class={`card-text text-small mb-0 text-secondary ${
						value - valueBefore < 0 ? "text-danger" : "text-success"
					}`}>
					{value - valueBefore < 0 ? null : "+ "}
					{formatMoney ? formatPrice(value - valueBefore) : value - valueBefore}
				</p>
			</div>
		</div>
	);
};

DashboardCard.defaultProps = {
	formatMoney: false,
};

export default DashboardCard;
