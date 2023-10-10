import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const AdminProductEditPage = () => {
	const { productId } = useParams();
	const [data, setData] = useState({ images: [] });
	const [category, setCategory] = useState("");
	const [rating, setRating] = useState("");

	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${productId}`)
			.then((res) => {
				setData(res.data?.productDetails[0]);
				const { category, rating } = res.data?.productDetails[0];
				setCategory(category);
				setRating(rating);
			})
			.catch((err) => console.log(err));
	}, []);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			category,
			rating,
		};
		axios
			.put(`${server}/products/edit-product-admin/${productId}`, formData)
			.then((res) => toast.success(res.data?.message));
	};
	return (
		<div className="w-100">
			<section className="row my-4">
				<img className="col-4 rounded-4" src={data.images[0]?.url} alt="" />
				<div className="col-6 my-auto">
					<p>Id: {data._id}</p>
					<p className="h4">{data.name}</p>
				</div>
			</section>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="mb-3">
					<label htmlFor="category" className="form-label">
						Category
					</label>
					<input
						type="text"
						className="form-control"
						id="category"
						value={category}
						name="category"
						onChange={(e) => setCategory(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="rating" className="form-label">
						Rating
					</label>
					<input
						type="number"
						className="form-control"
						id="rating"
						value={rating}
						name="rating"
						onChange={(e) => setRating(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Edit Product
				</button>
			</form>
		</div>
	);
};

export default AdminProductEditPage;
