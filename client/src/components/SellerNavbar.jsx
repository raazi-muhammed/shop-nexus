import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import server from "../server";
import toast from "react-hot-toast";

const SellerNavbar = ({ shopName }) => {
	let { shopId } = useParams();
	const navigate = useNavigate();

	const handleLogOut = () => {
		axios
			.get(`${server}/seller/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/seller/login");
				window.location.reload();
			});
	};
	return (
		<section className="w-100 bg-light">
			<div className="container container-xl">
				<section className="d-flex justify-content-between py-3">
					<div>
						<Link to={"/"} className="text-decoration-none text-primary h3">
							Shop Nexus
						</Link>
					</div>
					<section className="d-flex gap-3">
						<div className="btn-group">
							<button
								className="btn btn-secondary btn-sm text-white"
								type="button">
								<span className="mx-1"> {shopName}</span>
							</button>
							<button
								type="button"
								className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								<span className="visually-hidden">Toggle Dropdown</span>
							</button>
							<ul className="dropdown-menu">
								<li>
									<Link className="dropdown-item text-small" href="#">
										{shopId}
									</Link>
								</li>
								<li onClick={handleLogOut}>
									<Link className="dropdown-item text-danger fw-bold" href="#">
										Logout
									</Link>
								</li>
							</ul>
						</div>
					</section>
				</section>
			</div>
		</section>
	);
};

export default SellerNavbar;
