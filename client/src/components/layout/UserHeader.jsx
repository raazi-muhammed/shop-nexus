import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../assets/Icons";
import { useDispatch } from "react-redux";
import { setSearchTermOptions } from "../../app/feature/search/searchOptionsSlice";
const { shopIcon } = Icons;

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
						<ul class="navbar-nav mx-auto my-3 my-lg-auto w-50">
							<li style={{ maxWidth: "25rem" }} class="nav-item w-100 mx-auto">
								<form onSubmit={handleSearch} class="d-flex" role="search">
									<input
										style={{
											backgroundColor: "#43328a",
											borderColor: "#5b49a6",
										}}
										class="w-100 form-control me-2 text-white border-1 placeholder-color"
										type="search"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
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
