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
		{
			id: 4,
			question: "How do I reset my password if I forget it?",
			answer:
				"If you forget your password, click on the 'Forgot Password' link on the login page. Follow the instructions to reset your password. You'll receive an email with a link to set a new password.",
		},
		{
			id: 5,
			question: "Can I change my shipping address after placing an order?",
			answer:
				"Yes, you can update your shipping address if your order hasn't shipped yet. Contact our customer support as soon as possible with your order details, and they will help you make the necessary changes.",
		},
		{
			id: 6,
			question: "What is your process for handling returns and exchanges?",
			answer:
				"Our Returns and Exchanges process is designed to make it easy for you. Please visit our Returns & Exchanges page for detailed instructions on how to return or exchange products, including eligibility and timelines.",
		},
		{
			id: 7,
			question: "Do you offer gift wrapping and personalized messages?",
			answer:
				"Yes, we provide gift wrapping and the option to include personalized messages. During the checkout process, you can select these options to add a special touch to your order.",
		},
		{
			id: 8,
			question: "What is your policy on product warranties and repairs?",
			answer:
				"For information about our product warranties and repair services, please refer to our Warranty & Repair Policy. It contains details about warranty coverage and the repair process.",
		},
		{
			id: 9,
			question: "How can I subscribe to your newsletter and updates?",
			answer:
				"To subscribe to our newsletter and receive updates on promotions, product launches, and more, simply enter your email address in the 'Subscribe' section on our website's homepage. You'll start receiving our newsletters.",
		},
		{
			id: 10,
			question:
				"Are there any age restrictions for purchasing certain products?",
			answer:
				"Some of our products may have age restrictions. To find out if a product you're interested in has age restrictions, please check the product description on our website or contact our customer support team.",
		},
		{
			id: 11,
			question: "What do I do if I receive a damaged or defective product?",
			answer:
				"If you receive a damaged or defective product, please contact our customer support team immediately. We will arrange for a replacement or refund, and guide you through the return process.",
		},
		{
			id: 12,
			question: "Do you offer a loyalty program for frequent customers?",
			answer:
				"Yes, we have a loyalty program that rewards our frequent customers. You can find details about our loyalty program and its benefits on our Loyalty Program page.",
		},
		{
			id: 13,
			question: "Can I change the currency for pricing on your website?",
			answer:
				"Yes, you can change the currency displayed on our website. Use the currency selector in the top-right corner of the webpage to choose your preferred currency.",
		},
		{
			id: 14,
			question:
				"How do I check the availability of a product that's out of stock?",
			answer:
				"To inquire about the availability of a product that's out of stock, please contact our customer support team. They can provide information about restocking or alternative options.",
		},
		{
			id: 15,
			question: "What is your process for handling warranty claims?",
			answer:
				"To initiate a warranty claim, please contact our customer support team and provide the details of the issue. They will guide you through the warranty claim process, including any required documentation.",
		},
	];
	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xl ">
				<div
					className="accordion p-4 min-vh-100 w-100 shadow-none"
					id="accordionExample">
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
		</main>
	);
};

export default FAQsPage;
