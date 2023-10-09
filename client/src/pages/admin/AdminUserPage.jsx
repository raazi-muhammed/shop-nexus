import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

const AdminUserPage = () => {
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-users`)
			.then((res) => setData(res.data.userDetails));
	}, [refresh]);

	const handleDelete = (id, action) => {
		console.log(id);
		setRefresh(!refresh);
		axios
			.post(`${server}/admin/block-user`, { id, action })
			.then((res) => {
				toast.success(res.data.message);
				toast.error("Refresh if changes are not seen");
			})
			.catch((err) => console.log(err));
	};
	return (
		<section className="w-100 row gap-3 ">
			{data.map((e, i) => (
				<section key={i} className="bg-white p-4 rounded-4 col-4 text-center">
					<p className="text-primary h4 fw-bold m-0">{e.fullName}</p>
					<p className="text-small">{e.email}</p>
					{e.isBlocked ? (
						<button
							onClick={(event) => handleDelete(e._id, false)}
							className="btn btn-success ">
							Unblock User
						</button>
					) : (
						<button
							onClick={(event) => handleDelete(e._id, true)}
							className="btn btn-danger ">
							Block User
						</button>
					)}
				</section>
			))}
		</section>
	);
};

export default AdminUserPage;
