import React from "react";
import { Link } from "react-router-dom";
import Icons from "../../assets/Icons";
const { shopIcon } = Icons;

const UserHeader = () => {
	return (
		<div>
			<header class="navbar navbar-expand-lg bg-body-primary  bg-primary">
				<div class="container container-xxl ">
					<Link
						to={"/"}
						className="navbar-brand text-white h3 text-decoration-none ">
						Shop Nexus
					</Link>

					<button
						class="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav mx-auto my-3 my-lg-auto">
							<li class="nav-item">
								<form class="d-flex" role="search">
									<input
										class="form-control me-2"
										type="search"
										placeholder="Search"
										aria-label="Search"
									/>
								</form>
							</li>
						</ul>
						<Link to={"/seller/sign-up"}>
							<button className="btn btn-secondary text-white my-3 my-lg-auto px-3">
								<span className="pb-3 mb-1">{shopIcon}</span>
								<span className="ps-2 mb-0">Become A seller</span>
							</button>
						</Link>
					</div>
				</div>
			</header>
		</div>
	);
};

export default UserHeader;
