import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "../../../components/user/AddressCard";

const UserAllAddress = () => {
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();

	const handleRemoveAddress = (addressId) => {
		axios
			.post(
				`${server}/user/remove-address`,
				{ addressId },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch(setUserDataReducer(res.data.user));
				toast.success(res.data?.message || "Address Removed");
			})
			.catch((err) =>
				toast.error(err.data?.data?.message || "An error occurred")
			);
	};
	const setAsDefaultAddress = (addressId) => {
		axios
			.post(
				`${server}/user/set-default-address`,
				{ addressId },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch(setUserDataReducer(res.data.user));
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
			{userData?.addresses?.map((address, i) => (
				<AddressCard
					key={i}
					address={address}
					handleRemoveAddress={handleRemoveAddress}
					setAsDefaultAddress={setAsDefaultAddress}
				/>
			))}
		</div>
	);
};

export default UserAllAddress;
