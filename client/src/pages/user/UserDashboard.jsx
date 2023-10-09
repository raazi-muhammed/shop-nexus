import React from "react";
import AsideComp from "../../components/AsideComp";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
	const navigate = useNavigate();
	const asideItems = [{ name: "Edit User", link: "#" }];
	const handleLogOut = () => {
		axios
			.get(`${server}/user/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/");
				window.location.reload();
			});
	};
	return (
		<main className="vw-100 min-vh-100 row">
			<section className="col-3">
				<AsideComp asideItems={asideItems} />
				<button
					className="btn btn-sm btn-danger w-100 ms-3"
					onClick={handleLogOut}>
					Log out
				</button>
			</section>
			<section className="col-9">
				<p>hi</p>
			</section>
		</main>
	);
};

export default UserDashboard;
