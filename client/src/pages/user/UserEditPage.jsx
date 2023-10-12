import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

const UserEditPage = () => {
	const [userData, setUserData] = useState();
	const [userName, setUserName] = useState();
	const [email, setEmail] = useState();

	useEffect(() => {
		axios
			.get(`${server}/user/user-details`, { withCredentials: true })
			.then((res) => {
				setUserName(res.data?.user?.fullName);
				setEmail(res.data?.user?.email);
				setUserData(res.data.user);
			})
			.catch((err) =>
				toast.error(err.data.data.message || "An error occurred")
			);
	}, []);
	const handleEditUser = (e) => {
		e.preventDefault();
		const userFormData = {
			fullName: userName,
			email,
		};
		axios
			.put(`${server}/user/edit-user-details`, userFormData, {
				withCredentials: true,
			})
			.then((res) => toast.success(res.data.message || "Success"))
			.catch((err) =>
				toast.error(err.data.data.message || "An Error occurred")
			);
	};
	return (
		<form onSubmit={(e) => handleEditUser(e)}>
			<div className="mb-3">
				<label htmlFor="user-name" className="form-label">
					Name
				</label>
				<input
					type="text"
					className="form-control"
					id="user-name"
					name="userName"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="email" className="form-label">
					Email
				</label>
				<input
					type="email"
					className="form-control"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<button
				type="submit"
				className="btn btn-secondary text-white btn-block col-12">
				Update Data
			</button>
		</form>
	);
};

export default UserEditPage;
