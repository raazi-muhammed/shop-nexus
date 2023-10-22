import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";
import categoryArry from "../../utils/category";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../utils/styleClasses";

const SellerEditSingleProductPage = () => {
	const navigate = useNavigate();
	const [refresh, setRefresh] = useState(true);

	const [data, setData] = useState([]);
	const { productId } = useParams();
	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [stock, setStock] = useState("");
	const [imagesToDisplay, setImagesToDisplay] = useState([]);
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
			productId,
			productName,
			category,
			description,
			price,
			discountedPrice,
			stock,
			image,
		};

		axios
			.put(`${server}/products/edit-product/${productId}`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data?.message);
				setRefresh(!refresh);
			})
			.catch((err) => console.log(err.response.data.message));
	};

	/* For Deleting(soft) Product */
	const handleDelete = (e) => {
		axios
			.delete(`${server}/products/delete-product/${productId}`, {
				withCredentials: true,
			})
			.then((res) => {
				navigate(-1);
				toast.success(res.data?.message);
			})
			.catch((err) => console.log(err));
	};
	const handleRecover = (e) => {
		axios
			.delete(`${server}/products/recover-product/${productId}`, {
				withCredentials: true,
			})
			.then((res) => {
				navigate(-1);
				toast.success(res.data?.message);
			})
			.catch((err) => console.log(err));
	};

	const handleRemoveItem = (imgUrl) => {
		console.log(imgUrl);
		axios
			.put(
				`${server}/products/delete-product-image/${productId}`,
				{ imgUrl },
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success(res.data?.message);
				setRefresh(!refresh);
			})
			.catch((err) => toast.error(err.data?.data?.message || "Error"));
	};

	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${productId}`)
			.then((res) => {
				const {
					name,
					description,
					category,
					price,
					discount_price,
					stock,
					shop,
					sold_out,
					images,
				} = res.data?.productDetails[0];
				setData(res.data?.productDetails[0]);
				setProductName(name);
				setCategory(category);
				setDescription(description);
				setPrice(price);
				setDiscountedPrice(discount_price);
				setStock(stock);
				setImagesToDisplay(images);
			})
			.catch((err) => console.log(err));
	}, [refresh]);

	return (
		<div className="w-100">
			<p className="text-small text-secondary text-end">{productId}</p>

			<form
				noValidate
				onChange={handleFormChange}
				className={`${validationSetting} ${formClass}`}
				onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Product
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={productName}
							name="productName"
							onChange={(e) => setProductName(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
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
							{categoryArry.map((e) => (
								<option value={e}>{e}</option>
							))}
						</select>
					</div>
				</div>
				<div className="row">
					<label htmlFor="description" className={formLabelClass}>
						Description
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="description"
							value={description}
							name="description"
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
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
						<div class="invalid-feedback">Invalid</div>
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
						<div class="invalid-feedback">Invalid</div>
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
						<div class="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label
						htmlFor="image-url"
						className={`mt-lg-5 ${formLabelClass} `}></label>
					<div className={inputDivClass}>
						<section className="d-flex overflow-auto gap-3">
							{imagesToDisplay.map((e, i) => (
								<div className="col-3">
									<img className="w-100 rounded-4" src={e.url} alt="" />
									<button
										disabled={imagesToDisplay.length <= 1 ? true : false}
										type="button"
										className="btn btn-danger btn-sm mt-2 w-100"
										onClick={(event) => handleRemoveItem(e.url)}>
										Remove
									</button>
								</div>
							))}
						</section>
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
						/>
					</div>
				</div>

				<div className="row gap-3 m-1">
					<button
						disabled={!allowSubmission}
						type="submit"
						className="col btn btn-primary">
						Update Product
					</button>
					{!data?.isDeleted ? (
						<button className="col btn btn-danger" onClick={handleDelete}>
							Delete Product
						</button>
					) : (
						<button className="col btn btn-success" onClick={handleRecover}>
							Recover Product
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default SellerEditSingleProductPage;
