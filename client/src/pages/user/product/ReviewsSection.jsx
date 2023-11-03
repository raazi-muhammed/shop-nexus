import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import RatingStarInput from "../../../components/product/RatingStarInput";
import toast from "react-hot-toast";
import RatingStar from "../../../components/product/RatingStar";

const ReviewsSection = ({ productData, setProductData }) => {
	const [userProductBought, setUserProductBought] = useState();
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");

	useEffect(() => {
		if (productData.name) {
			axios
				.get(`${server}/products/get-reviews/${productData._id}`)
				.then((res) => {
					console.log(res.data.reviews);
					setReviews(res.data?.reviews || []);
				})
				.catch((err) =>
					toast.error(err.response?.data?.message || "An error occurred")
				);
		}
	}, []);

	useEffect(() => {
		if (productData.name) {
			axios
				.get(`${server}/products/can-user-place-review/${productData._id}`, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data.canPostReview) setUserProductBought(true);
				})
				.catch((err) =>
					toast.error(err.response?.data?.message || "An error occurred")
				);
		}
	}, []);

	const handleReviewSubmit = (e) => {
		e.preventDefault();
		console.log(rating, review);
		const data = {
			product: productData._id,
			rating,
			review,
		};

		axios
			.post(`${server}/user/add-review`, data, { withCredentials: true })
			.then((res) => {
				console.log(res.data.reviews);
				setReviews(res.data?.reviews || []);
			})
			.catch((err) =>
				toast.error(err.response?.data?.message || "An error occurred")
			);
	};
	return (
		<section>
			<section className="p-4">
				{reviews?.length == 0 ? (
					<p className="mt-3 mb-1 text-small text-center">No reviews yet</p>
				) : (
					<>
						<section className="row">
							{reviews.map((r) => (
								<section className="bg-light-subtle col-md-8 mx-auto rounded p-3 mb-2">
									<div className="d-flex mb-2">
										<div style={{ width: "2.5rem" }}>
											<img
												className="w-100 rounded-circle"
												src={r.review?.user?.avatar}
												alt=""
											/>
										</div>
										<p className="my-auto ms-2">{r.review?.user?.name}</p>
									</div>
									<RatingStar rating={r.review.rating} />
									<section>
										<p className="mt-1">{r.review.review}</p>
									</section>
								</section>
							))}
						</section>
					</>
				)}
			</section>
			<section>
				{userProductBought ? (
					<section>
						<form onSubmit={handleReviewSubmit}>
							<div className="d-flex justify-content-end ">
								<p className="mb-0 pt-1 me-2">Your Rating:</p>
								<RatingStarInput rating={rating} setRating={setRating} />
								<button
									disabled={rating === 0}
									type="submit"
									class="btn btn-primary btn-sm mb-3 ms-3 px-3">
									Submit
								</button>
							</div>
							<div class="mb-3">
								<label
									for="exampleInputEmail1"
									class="form-label visually-hidden">
									Post a Review
								</label>
								<textarea
									class="form-control"
									id="exampleFormControlTextarea1"
									value={review}
									onChange={(e) => setReview(e.target.value)}
									rows="3"
									placeholder="Add your Feedback"></textarea>
							</div>
						</form>
					</section>
				) : (
					<p>Buy the Product to post Review</p>
				)}
			</section>
		</section>
	);
};

export default ReviewsSection;
