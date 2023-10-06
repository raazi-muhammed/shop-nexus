import React from "react";

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
			<button className="btn btn-secondary text-white">Become A seller</button>
		</header>
	);
};

export default UserHeader;
