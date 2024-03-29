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
import SellerEventCardProduct from "../../../components/events/SellerEventCardProduct";
import typeOfEventsConstants from "../../../constants/typeOfEventConstants";
import eventAccessConstants from "../../../constants/eventAccessConstants";
import BarLoader from "react-spinners/BarLoader";

const SellerNewEvent = ({ shopId }) => {
	const today = new Date();
	const navigate = useNavigate();
	const location = useLocation();
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [eventName, setEventName] = useState("");
	const [category, setCategory] = useState(null);
	const [eventAccess, setEventAccess] = useState("ALL_USERS");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(today);
	const [endDate, setEndDate] = useState();
	const eventEndMaxDate = new Date(startDate);
	const [typeOfEvent, setTypeOfEvent] = useState("PRODUCT_BASED");
	const [discountPercentage, setDiscountPercentage] = useState("");
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
				`${server}/products/get-products-from-shop?page=${
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
			.catch((err) => toast.error(err.response.data.message));
	};

	const handleProductClick = (e) => {
		if (typeOfEvent === "COMBO_OFFER") {
			let newSelectedProducts = new Set(selectedProducts);
			newSelectedProducts.add(e.target.value);
			console.log(newSelectedProducts);

			if (selectedProducts.includes(e.target.value))
				newSelectedProducts.delete(e.target.value);

			console.log(newSelectedProducts);

			setSelectedProducts(Array.from(newSelectedProducts));
		} else setSelectedProducts([e.target.value]);
		console.log(selectedProducts);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setAllowSubmission(false);
		setLoadingCreate(true);

		let formData = [];
		if (
			typeOfEvent === "PRODUCT_BASED" ||
			typeOfEvent === "COMBO_OFFER" ||
			typeOfEvent === "BYE_ONE_GET_ONE_FREE"
		) {
			formData = {
				typeOfEvent,
				eventName: eventName.trim(),
				startDate,
				endDate,
				eventAccess,
				description: description.trim(),
				discountPercentage,
				image,
				shopId,
				selectedProducts,
			};
		} else if (typeOfEvent === "CATEGORY_BASED") {
			formData = {
				typeOfEvent,
				eventName: eventName.trim(),
				startDate,
				endDate,
				eventAccess,
				category,
				description: description.trim(),
				discountPercentage,
				image,
				shopId,
			};
		} else {
			formData = {
				typeOfEvent,
				eventName: eventName.trim(),
				startDate,
				endDate,
				eventAccess,
				description: description.trim(),
				discountPercentage,
				image,
				shopId,
			};
		}
		console.log(formData);
		axios
			.post(`${server}/event/new-event`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				//changing the last part of url
				navigate(location.pathname.replace(/[^/]*$/, "events"));
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "An error occurred");
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
					<label htmlFor="product-name" className={formLabelClass}>
						Start Date
					</label>
					<div className={inputDivClass}>
						<input
							type="date"
							min={today.toISOString().split("T")[0]}
							className="form-control"
							id="product-name"
							value={startDate.toISOString().split("T")[0]}
							name="expires"
							onChange={(e) => setStartDate(e.target.value)}
							required
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						End Date
					</label>
					<div className={inputDivClass}>
						<input
							type="date"
							min={eventEndMaxDate.toISOString().slice(0, 10)}
							className="form-control"
							id="product-name"
							value={endDate}
							name="expires"
							onChange={(e) => setEndDate(e.target.value)}
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
				{typeOfEvent === "PRODUCT_BASED" ||
				typeOfEvent === "COMBO_OFFER" ||
				typeOfEvent === "BYE_ONE_GET_ONE_FREE" ? (
					<>
						<div className="row">
							<label
								className={formLabelClass}
								htmlFor="categorySelect"></label>
							<div className={inputDivClass}>
								<button
									onClick={handleGetAllProducts}
									type="button"
									className="btn btn-light w-100"
									data-bs-toggle="modal"
									data-bs-target="#exampleModal">
									Select Products ({selectedProducts.length})
								</button>
							</div>
						</div>
					</>
				) : typeOfEvent === "CATEGORY_BASED" ? (
					<>
						<div className="row">
							<label className={formLabelClass} htmlFor="categorySelect">
								Category
							</label>
							<div className={inputDivClass}>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="form-select"
									required
									id="categorySelect">
									<option value="">Select Category</option>
									{categoriesConstants.map((e) => (
										<option key={e.key} value={e.key}>
											{e.value}
										</option>
									))}
								</select>
							</div>
							<div className="invalid-feedback">Invalid</div>
						</div>
					</>
				) : null}
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Discount Percentage
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={
								typeOfEvent === "BYE_ONE_GET_ONE_FREE"
									? 0.5
									: discountPercentage
							}
							name="discountPercentage"
							onChange={(e) => setDiscountPercentage(e.target.value)}
							pattern="^(0(\.\d*)?|1(\.0+)?)$"
							required
						/>
						<div className="invalid-feedback">
							Value must be between 0 and 1, and in the format 0.3 (not .3)
						</div>
					</div>
				</div>
				<div className="row">
					<label className={formLabelClass} htmlFor="categorySelect">
						Event Access to
					</label>
					<div className={inputDivClass}>
						<select
							value={eventAccess}
							onChange={(e) => setEventAccess(e.target.value)}
							className="form-select"
							required
							id="categorySelect">
							{eventAccessConstants.map((e) => (
								<option key={e.key} value={e.key}>
									{e.value}
								</option>
							))}
						</select>
					</div>
					<div className="invalid-feedback">Invalid</div>
				</div>
				<div
					className="modal fade"
					id="exampleModal"
					tabIndex="-1"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true">
					<div className="modal-dialog modal-dialog-scrollable">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="exampleModalLabel">
									Add Products
								</h1>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"></button>
							</div>
							<div className="modal-body">
								<form>
									{products.map((product, i) => (
										<>
											{!product.isDeleted && (
												<div className="form-check d-flex align-items-center">
													<input
														className="form-check-input"
														type="checkbox"
														checked={selectedProducts.includes(product._id)}
														value={product._id}
														onClick={(e) => handleProductClick(e)}
														id={product._id}
													/>
													<label
														className="form-check-label w-100"
														for={product._id}>
														<SellerEventCardProduct
															key={i}
															id={product._id}
															name={product.name}
															stock={product.stock}
															category={product.category}
															price={product.discountPrice}
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
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-sm btn-secondary text-white"
									data-bs-dismiss="modal">
									Close
								</button>
							</div>
						</div>
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
				<div className="row">
					<button
						disabled={!allowSubmission}
						type="submit"
						className={submitButtonClass}>
						Add Event
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

export default SellerNewEvent;
