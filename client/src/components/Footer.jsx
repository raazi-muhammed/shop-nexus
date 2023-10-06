import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
	const footer = [
		{
			heading: "Contact Information",
			links: [
				{ name: "Company Name", url: "#" },
				{ name: "Physical address", url: "#" },
				{ name: "Physical address", url: "#" },
				{ name: "Phone Number", url: "#" },
				{ name: "Email address", url: "#" },
			],
		},
		{
			heading: "Navigation Links",
			links: [
				{ name: "About Us", url: "#" },
				{ name: "Product", url: "#" },
				{ name: "Blog", url: "#" },
				{ name: "FAQs", url: "#" },
				{ name: "Privacy Policy", url: "#" },
				{ name: "Terms of Service", url: "#" },
			],
		},
		{
			heading: "Quick Links",
			links: [
				{ name: "Home", url: "#" },
				{ name: "Products", url: "#" },
				{ name: "Contact", url: "#" },
				{ name: "Blog", url: "#" },
			],
		},
		{
			heading: "Newsletter SignUp",
			links: [
				{ name: "Subscribe", url: "#" },
				{ name: "Refer", url: "#" },
			],
		},
	];
	return (
		<footer className="bg-light d-flex gap-5 justify-content-center pt-5  pb-3">
			<section>
				<h3 className="text-primary">Shop Nexus</h3>
				<p className="text-small text-secondary">Shop Nexus © 2023</p>
			</section>
			<section className="d-flex gap-5">
				{footer.map((section) => (
					<div>
						<p className="fw-bold text-small text-secondary m-0">
							{section.heading}
						</p>
						<ul className="text-small list-unstyled">
							{section.links.map((e) => (
								<Link className="text-secondary">
									<li>{e.name}</li>
								</Link>
							))}
						</ul>
					</div>
				))}
			</section>
		</footer>
	);
};

export default Footer;
