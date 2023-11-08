import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ErrorComp = () => {
	const navigate = useNavigate();
	return (
		<main className="p-5 min-vh-100">
			<div style={{ maxWidth: "35rem" }} className="mx-auto mt-5">
				<h2 className="display-4 fw-bold text-primary mb-0">404 Not Found</h2>
				<p className="text-secondary">
					Sorry, an error has occured, Requested page not found!
				</p>
				<div className="d-flex gap-3 ">
					<button
						onClick={() => navigate("/")}
						className="btn text-decoration-underline  fw-bold p-0 btn-sm text-secondary">
						Go Home
					</button>
					<button
						onClick={() => navigate(-1)}
						className="btn text-decoration-underline  fw-bold p-0 btn-sm text-secondary">
						Go Back
					</button>
				</div>
			</div>
		</main>
	);
};

export default ErrorComp;
