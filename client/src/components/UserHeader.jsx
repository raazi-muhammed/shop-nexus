import React from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
	return (
		<header className="d-flex justify-content-between vw-100 bg-primary p-3 text-white">
			<div>
				<h1>Shop Nexus</h1>
			</div>
			<div className="">
				<label htmlFor="search-product" className="form-label visually-hidden ">
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
		</header>
	);
};

export default UserHeader;
