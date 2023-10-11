import React from "react";
import { Link } from "react-router-dom";

const FooterComp = () => {
	const footerLinks = [
		{
			heading: "Contact Information",
			links: [
				{ name: "Company Name", link: "#" },
				{ name: "Physical address", link: "#" },
				{ name: "Email address", link: "#" },
			],
		},
		{
			heading: "Navigation Links",
			links: [
				{ name: "About Us", link: "#" },
				{ name: "Products", link: "#" },
				{ name: "Services", link: "#" },
				{ name: "Blog", link: "#" },
				{ name: "FAQs", link: "#" },
				{ name: "Privacy Policy", link: "#" },
				{ name: "Terms of Service", link: "#" },
			],
		},
		{
			heading: "Quick Links",
			links: [
				{ name: "Home", link: "#" },
				{ name: "Products", link: "#" },
				{ name: "Contact", link: "#" },
				{ name: "Blog", link: "#" },
			],
		},
		{
			heading: "Newsletter",
			links: [
				{ name: "Subscribe", link: "#" },
				{ name: "Unsubscribe", link: "#" },
			],
		},
	];
	return (
		<footer className="d-flex gap-5 justify-content-center bg-light p-5 mt-4">
			<section>
				<p className="text-primary h3">Shop Nexus</p>
				<p className="text-secondary">Shop Nexus © 2023</p>
			</section>
			{footerLinks.map((linkSection, i) => (
				<section key={i} className="d-flex flex-column gap-1">
					<p className="text-small text-secondary fw-bold m-0">
						{linkSection.heading}
					</p>
					{linkSection.links.map((links, i) => (
						<Link key={i} className="text-small text-secondary ">
							{links.name}
						</Link>
					))}
				</section>
			))}
		</footer>
	);
};

export default FooterComp;
