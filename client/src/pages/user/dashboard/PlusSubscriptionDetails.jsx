import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import server from "../../../server";
import axios from "axios";
import convertISOToDate from "../../../utils/convertISOToDate";
import PlusBenifits from "../../../components/nexusPlus/PlusBenifits";
import toast from "react-hot-toast";
import { setUserDataReducer } from "../../../app/feature/userData/userDataSlice";
import { useNavigate } from "react-router-dom";

const PlusSubscriptionDetails = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userData = useSelector((state) => state.userData.userData);
	const [subscriptionData, setSubscriptionData] = useState("");

	const handleCancelSubscription = () => {
		axios
			.put(`${server}/payment/cancel-subscription`, {
				subscriptionId: userData.plusMember.details.razorpay_subscription_id,
				userId: userData._id,
			})
			.then((res) => {
				console.log(res);
				toast.success(res.data?.message || "Success");
				dispatch(setUserDataReducer(res.data.user));
				setSubscriptionData(res.data?.subscriptionDetails);
				/* navigate("/"); */
				/* window.location.reload(); */
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		axios
			.get(
				`${server}/payment/subscription-details/${userData.plusMember.details.razorpay_subscription_id}`
			)
			.then((res) => {
				console.log(res);
				setSubscriptionData(res.data?.subscriptionDetails);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div>
			<section className="d-flex gap-5 ">
				<div>
					<p className="text-small text-secondary m-0">Status</p>
					<p className="text-capitalize">{subscriptionData.status}</p>
				</div>
				{subscriptionData.status === "active" && (
					<div>
						<p className="text-small text-secondary m-0">
							You are a member Since
						</p>
						<p>
							{convertISOToDate(new Date(subscriptionData.start_at * 1000))}
						</p>
						<p className="text-small text-secondary m-0">Next Payment On</p>
						<p>
							{convertISOToDate(new Date(subscriptionData.charge_at * 1000))}
						</p>
					</div>
				)}

				<button
					type="button"
					className="btn btn-light btn-sm ms-auto"
					data-bs-toggle="modal"
					data-bs-target="#exampleModal">
					Deactivate
				</button>

				<div
					class="modal fade"
					id="exampleModal"
					tabindex="-1"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content p-3 rounded-4 ">
							<div class="modal-body">
								Are you sure you want to Deactivate your Shop Nexus Plus
								Membership?
							</div>
							<div class="modal-footer border-0">
								<button
									type="button"
									class="btn btn-sm btn-danger"
									data-bs-dismiss="modal">
									Close
								</button>
								<button
									onClick={handleCancelSubscription}
									type="button"
									class="btn btn-sm btn-primary">
									Deactivate
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<hr className="text-secondary" />
			<section>
				<PlusBenifits />
			</section>
		</div>
	);
};

export default PlusSubscriptionDetails;
