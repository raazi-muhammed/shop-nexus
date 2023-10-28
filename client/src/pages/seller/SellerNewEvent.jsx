import axios from "axios";
import React, { useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import categoriesConstants from "../../constants/categoriesConstants";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../utils/styleClasses";
import { useNavigate, useParams } from "react-router-dom";
import ProductCardRow from "../../components/product/ProductCardRow";
import SellerEventCardProduct from "../../components/events/SellerEventCardProduct";
import typeOfEventsConstants from "../../constants/typeOfEventConstants";

const SellerNewEvent = () => {
	const { shopId } = useParams();
	const navigate = useNavigate();
	const [eventName, setEventName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [typeOfEvent, setTypeOfEvent] = useState("PRODUCT_BASED");
	const [price, setPrice] = useState("");
	const [discountedPrice, setDiscountedPrice] = useState("");
	const [image, setImage] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);

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

	const [products, setProducts] = useState([]);
	const [pagination, setPagination] = useState({});
	const handleGetAllProducts = () => {
		axios
			.get(
				`${server}/seller/get-products-from-shop/${shopId}?page=${
					pagination?.page || 1
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setProducts(res.data.data);
				setPagination(res.data.pagination);
			})
			.catch((err) => toast.error(err.response.data.message))
			.finally(() => {
				setLoading(false);
			});
	};

	const handleProductClick = (e) => {
		setSelectedProducts([e.target.value]);
		console.log(selectedProducts);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		const formData = {
			eventName,
			category,
			description,
			price,
			discountedPrice,
			image,
			shopId,
			selectedProducts,
		};
		console.log(formData);
		axios
			.post(`${server}/event/new-event`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				//navigate(-1);
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "An error occurred");
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
						Event Name
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control "
							id="product-name"
							value={eventName}
							name="eventName"
							onChange={(e) => setEventName(e.target.value)}
							required
						/>
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
					<label className={formLabelClass} htmlFor="categorySelect">
						Type of Event
					</label>
					<div className={inputDivClass}>
						<select
							value={typeOfEvent}
							onChange={(e) => setTypeOfEvent(e.target.value)}
							className="form-select"
							id="categorySelect">
							{typeOfEventsConstants.map((e) => (
								<option key={e.key} value={e.key}>
									{e.value}
								</option>
							))}
						</select>
					</div>
				</div>

				{typeOfEvent === "PRODUCT_BASED" ? (
					<div className="row">
						<label className={formLabelClass} htmlFor="categorySelect"></label>
						<div className={inputDivClass}>
							<button
								onClick={handleGetAllProducts}
								type="button"
								class="btn btn-light w-100"
								data-bs-toggle="modal"
								data-bs-target="#exampleModal">
								Select Products
							</button>
						</div>
					</div>
				) : (
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
								{categoriesConstants.map((e) => (
									<option key={e.key} value={e.key}>
										{e.value}
									</option>
								))}
							</select>
						</div>
					</div>
				)}
				<div
					class="modal fade"
					id="exampleModal"
					tabindex="-1"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true">
					<div class="modal-dialog modal-dialog-scrollable">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="exampleModalLabel">
									Add Products
								</h1>
								<button
									type="button"
									class="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<form>
									{products.map((product, i) => (
										<>
											{!product.isDeleted && (
												<div class="form-check d-flex align-items-center">
													<input
														class="form-check-input"
														type="checkbox"
														checked={selectedProducts.includes(product._id)}
														value={product._id}
														onClick={(e) => handleProductClick(e)}
														id={product._id}
													/>
													<label
														class="form-check-label w-100"
														for={product._id}>
														<SellerEventCardProduct
															key={i}
															id={product._id}
															name={product.name}
															stock={product.stock}
															category={product.category}
															price={product.discount_price}
															imgUrl={product.images[0]?.url}
															shopId={shopId}
														/>
													</label>
												</div>
											)}
										</>
									))}
								</form>
							</div>
							<div class="modal-footer">
								<button
									type="button"
									class="btn btn-sm btn-secondary"
									data-bs-dismiss="modal">
									Close
								</button>
								<button type="button" class="btn btn-sm btn-primary">
									Save changes
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="price" className={formLabelClass}>
						Actual Price
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="discounted-price"
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
						Add Images
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

export default SellerNewEvent;
