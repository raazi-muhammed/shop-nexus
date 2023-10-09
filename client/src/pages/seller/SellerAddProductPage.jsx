import axios from "axios";
import React, { useState } from "react";
import server from "../../server";

const SellerAddProductPage = ({ shopId, shopName }) => {
	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [rating, setRating] = useState("");
	const [stock, setStock] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			productName,
			category,
			description,
			price,
			discountedPrice,
			imageUrl,
			rating,
			stock,
			shopId,
			shopName,
		};

		axios.post(`${server}/products/add-product`, formData).then((res) => {
			console.log(res);
		});

		//console.log(formData);
	};
	return (
		<section>
			<h3>Add an User</h3>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="mb-3">
					<label htmlFor="product-name" className="form-label">
						Product Name
					</label>
					<input
						type="text"
						className="form-control"
						id="product-name"
						value={productName}
						name="productName"
						onChange={(e) => setProductName(e.target.value)}
						required
					/>
				</div>
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
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<input
						type="text"
						className="form-control"
						id="description"
						value={description}
						name="description"
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="price" className="form-label">
						Price
					</label>
					<input
						type="number"
						className="form-control"
						id="price"
						value={price}
						name="price"
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="discounted-price" className="form-label">
						Discounted Price
					</label>
					<input
						type="number"
						className="form-control"
						id="discounted-price"
						value={discountedPrice}
						name="discountedPrice"
						onChange={(e) => setDiscountedPrice(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="image-url" className="form-label">
						Image Url
					</label>
					<input
						type="text"
						className="form-control"
						id="image-url"
						value={imageUrl}
						name="imageUrl"
						onChange={(e) => setImageUrl(e.target.value)}
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
				<div className="mb-3">
					<label htmlFor="number" className="form-label">
						Stock
					</label>
					<input
						type="number"
						className="form-control"
						id="stock"
						value={stock}
						name="stock"
						onChange={(e) => setStock(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Add Product
				</button>
			</form>
		</section>
	);
};

export default SellerAddProductPage;
