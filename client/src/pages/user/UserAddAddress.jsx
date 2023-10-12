import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

const UserAddAddress = () => {
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pinCode, setPinCode] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [addressType, setAddressType] = useState("Home");

	const addressData = {
		fullName,
		phoneNumber,
		pinCode,
		state,
		city,
		addressLine1,
		addressLine2,
		addressType,
	};

	const handleAddAddress = (e) => {
		e.preventDefault();
		axios
			.post(`${server}/user/add-address`, addressData, {
				withCredentials: true,
			})
			.then((res) => toast.success(res.data.message || "Success"))
			.catch((err) =>
				toast.error(err.response.data.message || "An Error occurred")
			);
	};

	return (
		<form onSubmit={(e) => handleAddAddress(e)}>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					Full Name
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					Phone Number
				</label>
				<input
					type="number"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					Pin Code
				</label>
				<input
					type="number"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={pinCode}
					onChange={(e) => setPinCode(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					State
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={state}
					onChange={(e) => setState(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					City
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={city}
					onChange={(e) => setCity(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-1" className="form-label">
					Address Line 1
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-1"
					name="addressLine1"
					value={addressLine1}
					onChange={(e) => setAddressLine1(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-2" className="form-label">
					Address Line 2
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-2"
					name="addressLine2"
					value={addressLine2}
					onChange={(e) => setAddressLine2(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="address-line-2" className="form-label">
					Address Type
				</label>
				<input
					type="text"
					className="form-control"
					id="address-line-2"
					name="addressLine2"
					value={addressType}
					onChange={(e) => setAddressType(e.target.value)}
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

export default UserAddAddress;
