import React from "react";
import Icons from "../../assets/Icons";

const { personHeart, bagHeartFill, personHearts } = Icons;

const ReferralFeatures = () => {
	const features = [
		{
			heading: "Earn ₹100 for Every Referral",
			subtext:
				"Receive a generous ₹100 reward every time you refer someone to our service or products. It's that simple!",
			icon: personHeart,
		},
		{
			heading: "Double Up: ₹100 Bonus on Their First Purchase",
			subtext:
				"Not only do you get ₹100 for referring a friend, but your friends also receive an exclusive ₹100 bonus on their very first purchase.",
			icon: personHearts,
		},
		{
			heading: "Unlock 20% Off Your First Purchase with Referral",
			subtext:
				"As a referrer, enjoy an exclusive 20% discount on your first purchase, thanks to your referral. It's a win-win for both you and your friends!",
			icon: bagHeartFill,
		},
	];
	return (
		<section className="row gap-4">
			{features.map((benefit) => (
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

export default ReferralFeatures;
