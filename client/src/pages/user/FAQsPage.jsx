import React from "react";

const FAQsPage = () => {
	let faqs = [
		{
			id: 1,
			question: "How can I place an order",
			answer:
				"To place an order, simply browse our website, select the desired products, and add them to your cart. Then, proceed to checkout, where you can provide shipping and payment information.",
		},
		{
			id: 2,
			question: "What payment methods do you accept?",
			answer:
				"We accept a variety of payment methods, including credit/debit cards, PayPal, and more. You can find the full list of accepted payment options during the checkout process.",
		},
		{
			id: 3,
			question: "Is my personal information secure when making a purchase?",
			answer:
				"Yes, your privacy and security are important to us. We use secure, encrypted connections to protect your personal information during online transactions. For more details, please review our Privacy Policy",
		},
	];
	return (
		<div className="w-100 container container-xl ">
			<div className="accordion p-4 min-vh-100 w-100 " id="accordionExample">
				{faqs.map((faq, i) => (
					<div key={i} className="accordion-item">
						<h2 className="accordion-header">
							<button
								className="accordion-button collapsed"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target={"#collapseOne" + faq.id}
								aria-expanded="false"
								aria-controls={"collapseOne" + faq.id}>
								{faq.question}
							</button>
						</h2>
						<div
							id={"collapseOne" + faq.id}
							className="accordion-collapse collapse "
							data-bs-parent="#accordionExample">
							<div className="accordion-body">{faq.answer}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQsPage;
