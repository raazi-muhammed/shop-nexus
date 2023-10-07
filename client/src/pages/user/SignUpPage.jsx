import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../server";

const SignUpPage = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [age, setAge] = useState("");
	const [password, setPassword] = useState("");
	const [profilePhoto, setProfilePhoto] = useState(null);
	const navigate = useNavigate();
	const handleFileInputChange = (e) => {
		setProfilePhoto(e.target.files[0]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newForm = {
			fullName: fullName,
			email: email,
			age: age,
			password: password,
			profilePhoto: profilePhoto,
		};
		axios
			.post(`${server}/user/create-user`, newForm)
			.then((res) => {
				console.log(res);
				//navigate("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<main className="my-auto mx-auto row container-max-width bg-white rounded-4">
			<section className="col-12 p-5 my-auto">
				<h3>Create an account</h3>
				<p className="text-small">
					please enter you details to create an account
				</p>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="mb-3">
						<label htmlFor="full-name" className="form-label">
							Full Name
						</label>
						<input
							type="text"
							className="form-control"
							id="full-name"
							name="fullName"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
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
					<div className="mb-3">
						<label htmlFor="age" className="form-label">
							Age
						</label>
						<input
							type="number"
							className="form-control"
							id="age"
							name="age"
							value={age}
							onChange={(e) => setAge(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{/* <div className="mb-3">
						{profilePhoto ? (
							<img src={URL.createObjectURL(profilePhoto)} alt="" srcSet="" />
						) : (
							<img src={loginCover} alt="" srcSet="" className="w-25" />
						)}
						<label htmlFor="profile-picture" className="form-label">
							Profile Photo
						</label>
						<input
							type="file"
							className="form-control"
							id="profile-picture"
							name="profilePicture"
							onChange={(e) => handleFileInputChange(e)}
						/>
					</div> */}

					<button type="submit" className="btn btn-primary btn-block col-12 ">
						Log In
					</button>
				</form>
				<p>
					Alread Have an Account? <Link to="/login"> Log In</Link>
				</p>
			</section>
		</main>
	);
};

export default SignUpPage;
