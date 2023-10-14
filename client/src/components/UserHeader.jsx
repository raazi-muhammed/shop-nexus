import React from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
	return (
		<header className=" vw-100 bg-primary p-3 text-white">
			<div className="container container-xxl">
				<div className="d-flex justify-content-between">
					<div>
						<Link to={"/"} className="text-white h3 text-decoration-none ">
							Shop Nexus
						</Link>
					</div>
					<div className="">
						<label
							htmlFor="search-product"
							className="form-label visually-hidden ">
							Search Product
						</label>
						<input
							type="text"
							className="form-control"
							id="search-product"
							placeholder="Search"
						/>
					</div>
					<Link to={"/seller/sign-up"}>
						<button className="btn btn-secondary text-white">
							Become A seller
						</button>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default UserHeader;
