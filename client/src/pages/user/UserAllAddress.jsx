import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";

const UserAllAddress = () => {
	const [userData, setUserData] = useState();

	useEffect(() => {
		axios
			.get(`${server}/user/user-details`, { withCredentials: true })
			.then((res) => {
				setUserData(res.data?.user);
			})
			.catch((err) =>
				toast.error(err.data?.data?.message || "An error occurred")
			);
	}, []);

	const handleRemoveAddress = (addressId) => {
		axios
			.post(
				`${server}/user/remove-address`,
				{ addressId },
				{ withCredentials: true }
			)
			.then((res) => {
				setUserData(res.data?.user);
				toast.success(res.data?.message || "Address Removed");
			})
			.catch((err) =>
				toast.error(err.data?.data?.message || "An error occurred")
			);
	};
	return (
		<div>
			{userData?.addresses?.length === 0 && (
				<p className="m-4 text-secondary">No saved Addresses</p>
			)}
			{userData?.addresses?.map((address) => (
				<section className="bg-white p-3 m-2 rounded-4">
					<div className="row w-100">
						<div className="col">
							<p className="m-0 text-small text-secondary">Full Name</p>
							<p>{address?.fullName}</p>
							<p className="m-0 text-small text-secondary">Phone Number</p>
							<p>{address?.phoneNumber}</p>
							<p className="m-0 text-small text-secondary">City</p>
							<p>{address?.city}</p>
							<p className="m-0 text-small text-secondary">State</p>
							<p>{address?.state}</p>
						</div>
						<div className="col">
							<p className="m-0 text-small text-secondary">PinCode</p>
							<p>{address?.pinCode}</p>
							<p className="m-0 text-small text-secondary">Address Line 1</p>
							<p>{address?.address1}</p>
							<p className="m-0 text-small text-secondary">Address Line 2</p>
							<p>{address?.address2}</p>
							<p className="m-0 text-small text-secondary">Address Type</p>
							<p>{address?.addressType}</p>
						</div>
					</div>
					<button
						onClick={() => handleRemoveAddress(address?._id)}
						className="btn btn-sm btn-light text-danger">
						Remove Address
					</button>
				</section>
			))}
		</div>
	);
};

export default UserAllAddress;
