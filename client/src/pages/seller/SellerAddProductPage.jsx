import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import categoryArry from "../../utils/category";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../utils/styleClasses";
import { useNavigate } from "react-router-dom";

const SellerAddProductPage = ({ shopId, shopName }) => {
	const navigate = useNavigate();
	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [rating, setRating] = useState("");
	const [stock, setStock] = useState("");
	const [image, setImage] = useState([]);

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

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
		setAllowSubmission(false);
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
				navigate(-1);
				toast.success(res.data.message);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			});
	};
	return (
		<section>
			<form
				noValidate
				className={`${validationSetting} ${formClass}`}
				onChange={handleFormChange}
				onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Product Name
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control "
							id="product-name"
							value={productName}
							name="productName"
							onChange={(e) => setProductName(e.target.value)}
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label className={formLabelClass} htmlFor="categorySelect">
						Category
					</label>
					<div className={inputDivClass}>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="form-select"
							id="categorySelect">
							<option value="">Select Category</option>
							{categoryArry.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="row">
					<label htmlFor="description" className={formLabelClass}>
						Description
					</label>
					<div className={inputDivClass}>
						<textarea
							type="text-area"
							className="form-control"
							id="description"
							value={description}
							name="description"
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="price" className={formLabelClass}>
						Price
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="price"
							value={price}
							name="price"
							onChange={(e) => setPrice(e.target.value)}
							pattern="^[0-9]\d*$"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="discounted-price" className={formLabelClass}>
						Discounted Price
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="discounted-price"
							value={discountedPrice}
							name="discountedPrice"
							onChange={(e) => setDiscountedPrice(e.target.value)}
							pattern="^[0-9]\d*$"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="image-url" className={formLabelClass}>
						Add Image
					</label>
					<div className={inputDivClass}>
						<input
							type="file"
							className="form-control"
							id="image-url"
							name="imageUrl"
							onChange={(e) => handleFileInputChange(e)}
							accept="image/*"
							multiple
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="number" className={formLabelClass}>
						Stock
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="stock"
							value={stock}
							name="stock"
							onChange={(e) => setStock(e.target.value)}
							pattern="^[0-9]\d*$"
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<button
					disabled={!allowSubmission}
					type="submit"
					className={submitButtonClass}>
					Add Product
				</button>
			</form>
		</section>
	);
};

export default SellerAddProductPage;
