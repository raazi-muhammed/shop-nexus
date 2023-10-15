import React, { useEffect, useState } from "react";
import server from "../../server";
import axios from "axios";

const AdminSellerPage = () => {
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-sellers`, { withCredentials: true })
			.then((res) => setData(res.data.shopDetails))
			.catch((err) => toast.error(err.response.data.message));
	}, [refresh]);

	const handBlockAndUnBlock = (id, action) => {
		console.log(id);
		setRefresh(!refresh);
		axios
			.post(
				`${server}/admin/block-seller`,
				{ id, action },
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success(res.data.message);
				toast.error("Refresh if changes are not seen");
			})
			.catch((err) => toast.error(err.response.data.message));
	};
	return (
		<section className="w-100 row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 ">
			{data.map((e, i) => (
				<div className="col p-3">
					<section key={i} className="bg-white p-4 rounded-4 text-center">
						<img
							className="rounded-circle"
							style={{ width: "4rem", height: "4rem" }}
							src={
								e.image?.url ||
								"http://localhost:3000/images/profile-pic-1697175479482_300657077.png"
							}
							alt=""
						/>
						<p className="text-primary h4 fw-bold m-0">{e.shopName}</p>
						<p className="text-small">{e.email}</p>
						{e.isBlocked ? (
							<button
								onClick={(event) => handBlockAndUnBlock(e._id, false)}
								className="btn btn-success ">
								Unblock User
							</button>
						) : (
							<button
								onClick={(event) => handBlockAndUnBlock(e._id, true)}
								className="btn btn-danger ">
								Block User
							</button>
						)}
					</section>
				</div>
			))}
		</section>
	);
};

export default AdminSellerPage;