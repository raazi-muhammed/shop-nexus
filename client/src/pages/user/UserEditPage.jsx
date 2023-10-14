import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import {
	formLabelClass,
	inputDivClass,
	formClass,
} from "../../utils/styleClasses";

const UserEditPage = () => {
	const [userData, setUserData] = useState("");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [userAvatar, setUserAvatar] = useState("");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	useEffect(() => {
		axios
			.get(`${server}/user/user-details`, { withCredentials: true })
			.then((res) => {
				setUserName(res.data?.user?.fullName);
				setEmail(res.data?.user?.email);
				setUserData(res.data.user);
				setUserAvatar(res.data?.user?.avatar?.url);
			})
			.catch((err) =>
				toast.error(err.data.data.message || "An error occurred")
			);
	}, []);
	const handleEditUser = (e) => {
		e.preventDefault();

		let userFormData = new FormData();
		userFormData.append("fullName", userName);
		userFormData.append("email", email);
		userFormData.append("file", userAvatar);

		const config = {
			headers: { "content-type": "multipart/form-data" },
			withCredentials: true,
		};

		axios
			.put(`${server}/user/edit-user-details`, userFormData, config)
			.then((res) => {
				toast.success(res.data.message || "Success");
				setUserAvatar(res.data?.user?.avatar?.url);
			})
			.catch((err) =>
				toast.error(err.data.data.message || "An Error occurred")
			);
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		setUserAvatar(file);
	};

	return (
		<form
			noValidate
			className={`${validationSetting} ${formClass}`}
			onChange={handleFormChange}
			onSubmit={handleEditUser}>
			<div className="row align-items-center">
				<div className={formLabelClass}>
					<img
						className="rounded-circle"
						style={{ width: "4rem", height: "4rem" }}
						src={
							userAvatar
								? userAvatar
								: "http://localhost:3000/images/profile-pic-1697175479482_300657077.png"
						}
						alt=""
					/>
				</div>
				<div className={`${inputDivClass} m-0`}>
					<input
						accept="image/*"
						className="form-control"
						type="file"
						id="formFileMultiple"
						onChange={(e) => handleFileInputChange(e)}
					/>
				</div>
			</div>
			<div className="row">
				<label htmlFor="user-name" className={formLabelClass}>
					Name
				</label>
				<div className={inputDivClass}>
					<input
						type="text"
						className="form-control"
						id="user-name"
						name="userName"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<div className="row">
				<label htmlFor="email" className={formLabelClass}>
					Email
				</label>
				<div className={inputDivClass}>
					<input
						type="email"
						className="form-control"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<div class="invalid-feedback">Invalid</div>
				</div>
			</div>
			<button
				disabled={!allowSubmission}
				type="submit"
				className="btn btn-secondary text-white col-12 col-lg-6 align-self-center">
				Update Data
			</button>
		</form>
	);
};

export default UserEditPage;
