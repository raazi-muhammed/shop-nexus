import axios from "axios";
import React, { useState } from "react";
import server from "../../../server";
import toast from "react-hot-toast";
import categoriesConstants from "../../../constants/categoriesConstants";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";
import { useLocation, useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

const SellerAddProductPage = ({ shopId, shopName }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [productName, setProductName] = useState("");
	const [loadingCreate, setLoadingCreate] = useState(false);
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
		setLoadingCreate(true);
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
				//changing the last part of url
				navigate(location.pathname.replace(/[^/]*$/, "all-products"));
				toast.success(res.data.message);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => setLoadingCreate(false));
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
							id="categorySelect"
							required>
							<option value="">Select Category</option>
							{categoriesConstants.map((e) => (
								<option key={e.key} value={e.key}>
									{e.value}
								</option>
							))}
						</select>
						<div className="invalid-feedback">Invalid</div>
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
							style={{ height: "10rem" }}
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
				<div className="row">
					<button
						disabled={!allowSubmission}
						type="submit"
						className={submitButtonClass}>
						Add Product
					</button>
					<div className="col-12">
						<BarLoader
							className="m-0 p-0 text-primary mx-auto mt-1"
							loading={loadingCreate}
							color="#342475"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				</div>
			</form>
		</section>
	);
};

export default SellerAddProductPage;
