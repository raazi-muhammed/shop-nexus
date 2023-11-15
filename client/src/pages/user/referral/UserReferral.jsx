import React, { useState } from "react";
import ReferralFeatures from "../../../components/referral/ReferralFeatures";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import server from "../../../server";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import formatPrice from "../../../utils/formatPrice";

const UserReferral = () => {
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();

	const handleCopy = (copyText) => {
		navigator.clipboard.writeText(copyText);
		toast.success(`Copied`);
	};
	const handleStartReferral = () => {
		axios.defaults.withCredentials = true;

		console.log("hi");
		axios
			.put(`${server}/user/start-referral`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data?.message || "Success");
				dispatch(setUserDataReducer(res.data?.user));
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response?.data?.message || "An error occurred");
			});
	};

	return (
		<main>
			{!userData?.referral?.myCode ? (
				<section className="p-3">
					<p className="text-secondary h2 fw-bold ">
						Begin Referring to Start Earning
					</p>
					<p className="text-secondary">
						Unlock a world of opportunity by referring friends, family, and
						colleagues to our platform. As they join and engage, you earn money
						and rewards. It's a win-win for you and your network!
					</p>
					<button
						onClick={handleStartReferral}
						className="btn btn-sm btn-primary text-white">
						Start Referring Now
					</button>
				</section>
			) : (
				<section className="bg-white rounded p-3">
					<p className="text-small text-secondary m-0 ms-2">
						Your referral Code
					</p>
					<div className="d-flex justify-content-between align-items-center ms-2">
						<p className="m-0 h5">{userData?.referral.myCode}</p>
						<div>
							<button
								onClick={() => handleCopy(userData?.referral.myCode)}
								className="btn btn-light btn-sm">
								Copy Code
							</button>
							<button
								onClick={() =>
									handleCopy(
										`http://localhost:5173/sign-up?referralCode=${userData?.referral.myCode}`
									)
								}
								className="btn btn-secondary text-white btn-sm mx-2">
								Copy Link
							</button>
						</div>
					</div>

					<section className="d-flex gap-3 w-100 mt-3">
						<div className="bg-secondary-subtle rounded p-3 col">
							<p className="m-0 text-secondary">Total Referrals</p>
							<p className="m-0 h2">{userData?.referral?.myReferrals?.count}</p>
						</div>
						<div className="bg-secondary-subtle rounded p-3 col">
							<p className="m-0 text-secondary">Money Via Referral</p>
							<p className="m-0 h2">
								{formatPrice(
									userData?.referral?.myReferrals?.moneyViaReferral
								) || `-    `}
							</p>
						</div>
					</section>
				</section>
			)}
			<div className="px-3">
				<hr className="text-secondary" />
			</div>
			<section className="p-3 mt-2">
				<ReferralFeatures />
			</section>
		</main>
	);
};

export default UserReferral;
