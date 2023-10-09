import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const SellerEditSingleProductPage = () => {
	const [data, setData] = useState("loding");
	const { productId } = useParams();

	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [stock, setStock] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			productId,
			productName,
			category,
			description,
			price,
			discountedPrice,
			stock,
		};

		axios
			.put(`${server}/products/edit-product/${productId}`, formData)
			.then((res) => toast.success(res.data?.message))
			.catch((err) => console.log(err));
	};

	const handleDelete = (e) => {
		axios
			.delete(`${server}/products/delete-product/${productId}`)
			.then((res) => toast.success(res.data?.message))
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${productId}`)
			.then((res) => {
				console.log(res.data?.productDetails[0]);
				const {
					name,
					description,
					category,
					price,
					discount_price,
					stock,
					shop,
					sold_out,
				} = res.data?.productDetails[0];
				setData(res.data);
				setProductName(name);
				setCategory(category);
				setDescription(description);
				setPrice(price);
				setDiscountedPrice(discount_price);
				setStock(stock);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div>
			<p>{productId}</p>
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
					Edit Product
				</button>
			</form>

			<button className="btn btn-danger" onClick={handleDelete}>
				Delete Product
			</button>

			<p>{JSON.stringify(data)}</p>
		</div>
	);
};

export default SellerEditSingleProductPage;
