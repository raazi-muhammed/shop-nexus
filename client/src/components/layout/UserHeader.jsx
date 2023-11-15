import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../assets/Icons";
import { useDispatch } from "react-redux";
import { setSearchTermOptions } from "../../app/feature/search/searchOptionsSlice";
const { shopIcon, threeLine } = Icons;

const UserHeader = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();
	const handleSearch = (e) => {
		e.preventDefault();
		dispatch(setSearchTermOptions(searchTerm));
		navigate(`/search`);
	};
	return (
		<div className="vw-100">
			<header className="navbar navbar-expand-lg bg-body-primary bg-primary">
				<div className="container container-xxl ">
					<Link
						to={"/"}
						className="navbar-brand text-white h3 text-decoration-none ">
						Shop Nexus
					</Link>

					<button
						className="navbar-toggler btn"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span className="text-secondary">{threeLine}</span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mx-auto my-3 my-lg-auto">
							<li
								style={{ maxWidth: "25rem", minWidth: "18rem" }}
								className="nav-item w-100 mx-auto">
								<form onSubmit={handleSearch} className="d-flex" role="search">
									<input
										style={{
											backgroundColor: "#43328a",
											borderColor: "#5b49a6",
										}}
										className="w-100 form-control me-2 text-white border-1 placeholder-color"
										type="search"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder="Search"
										aria-label="Search"
									/>
								</form>
							</li>
						</ul>
						<Link to={"/seller/login"}>
							<button className="w-100 btn btn-secondary text-white my-3 my-lg-auto px-3">
								<span className="pb-3 mb-1">{shopIcon}</span>
								<span className="ps-2 mb-0">Seller Login</span>
							</button>
						</Link>
					</div>
				</div>
			</header>
		</div>
	);
};

export default UserHeader;
