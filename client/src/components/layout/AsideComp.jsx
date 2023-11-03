import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icons from "../../assets/Icons";
const { threeLine } = Icons;

const AsideComp = ({ asideItems }) => {
	const location = useLocation();
	const [currentNav, setCurrentNav] = useState(0);

	useEffect(() => {
		asideItems.map((e, i) => {
			if (location.pathname.includes(`/${e.link}`)) setCurrentNav(i);
		});
	}, [location.pathname]);

	return (
		<>
			<button
				class="btn d-lg-none d-flex align-items-center  "
				type="button"
				data-bs-toggle="offcanvas"
				data-bs-target="#offcanvasTop"
				aria-controls="offcanvasTop">
				<span className="text-secondary mb-2 me-2">{threeLine}</span>
				<span className="h3 text-secondary">{asideItems[currentNav].name}</span>
			</button>
			<hr className="text-light d-lg-none" />
			<div
				class="offcanvas-lg offcanvas-start col-12 col-md-4 col-lg-3"
				tabindex="-1"
				id="offcanvasTop"
				aria-labelledby="offcanvasTopLabel">
				<section className="offcanvas-body col-12  p-0">
					<button
						type="button"
						class="btn-close d-flex ms-auto m-3 mb-1 d-lg-none"
						data-bs-target="#offcanvasTop"
						data-bs-dismiss="offcanvas"
						aria-label="Close"></button>

					<nav className="d-flex bg-white flex-column p-4 rounded-4 w-100 gap-1 justify-content-center">
						{asideItems.map((e, i) => (
							<>
								{e.heading ? (
									<div>
										<p className="text-small mt-2 mx-2 m-0 fw-bold text-secondary">
											{e.name}
										</p>
										<hr className="m-0 mx-2 text-secondary" />
									</div>
								) : (
									<Link key={i} to={e.link}>
										<button
											onClick={(e) => setCurrentNav(i)}
											className={`btn btn-sm text-start w-100 
						${currentNav === i ? "text-white bg-secondary" : "text-secondary"}`}>
											{e.name}
										</button>
									</Link>
								)}
							</>
						))}
					</nav>
				</section>
			</div>
		</>
	);
};

export default AsideComp;
