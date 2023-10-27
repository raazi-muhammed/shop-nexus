import React from "react";
import Icons from "../../assets/Icons";
const { cartFill, message, calender } = Icons;

const PlusBenifits = () => {
	const benefits = [
		{
			heading: "Free Shipping",
			subtext: "No additional cost for home delivery.",
			icon: cartFill,
		},
		{
			heading: "Exclusive Event Access",
			subtext: "Be the first to know about special events and promotions.",
			icon: calender,
		},
		{
			heading: "Direct Shop Chat",
			subtext: "Instantly connect with the shop for questions and assistance.",
			icon: message,
		},
	];
	return (
		<section className="row gap-4">
			{benefits.map((benefit) => (
				<div class="card col border-0">
					<div class="card-body">
						<div className="text-secondary pb-3" style={{ width: "3rem" }}>
							{benefit.icon}
						</div>
						<h5 class="card-title fw-bold text-primary">{benefit.heading}</h5>
						<p class="card-text text-small text-secondary">{benefit.subtext}</p>
					</div>
				</div>
			))}
		</section>
	);
};

export default PlusBenifits;
