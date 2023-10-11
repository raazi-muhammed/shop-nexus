import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import categoryArry from "../../utils/category";

const SellerAddProductPage = ({ shopId, shopName }) => {
	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [rating, setRating] = useState("");
	const [stock, setStock] = useState("");
	const [image, setImage] = useState([]);

	const convertBase64 = (file) => {
		return new Promise((res, rej) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				res(fileReader.result);
			};
			fileReader.onerror = (err) => {
				rej(err);
			};
		});
	};

	const handleFileInputChange = async (e) => {
		const newImage = [];
		for (let i = 0; i < e.target.files.length; i++) {
			const file = e.target.files[i];
			const base64 = await convertBase64(file);
			newImage.push(base64);
		}

		setImage(newImage);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			productName,
			category,
			description,
			price,
			discountedPrice,
			image,
			rating,
			stock,
			shopId,
			shopName,
		};
		console.log(formData);
		axios
			.post(`${server}/products/add-product`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data.message);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			});
	};
	return (
		<section>
			<h3>Add an Product</h3>
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
					<label className="form-label" htmlFor="categorySelect">
						Select a Category:
					</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="form-select"
						id="categorySelect">
						<option value="">Select Category</option>
						{categoryArry.map((e) => (
							<option value={e}>{e}</option>
						))}
					</select>
				</div>
				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<textarea
						type="text-area"
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
						Add Image
					</label>
					<input
						type="file"
						className="form-control"
						id="image-url"
						name="imageUrl"
						onChange={(e) => handleFileInputChange(e)}
						multiple
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
