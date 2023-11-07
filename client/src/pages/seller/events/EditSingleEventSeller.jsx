import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import server from "../../../server";
import {
	formLabelClass,
	inputDivClass,
	formClass,
	submitButtonClass,
} from "../../../utils/styleClasses";
import typeOfEventsConstants from "../../../constants/typeOfEventConstants";
import toast from "react-hot-toast";

const EditSingleEventSeller = () => {
	const today = new Date();
	const navigate = useNavigate();
	const { eventId } = useParams();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(today);
	const [endDate, setEndDate] = useState(today);
	const eventEndMaxDate = new Date(startDate);
	const [typeOfEvent, setTypeOfEvent] = useState("PRODUCT_BASED");
	const [discountPercentage, setDiscountPercentage] = useState("");
	const [image, setImage] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const [validationSetting, setValidationSetting] =
		useState("needs-validation");
	const [allowSubmission, setAllowSubmission] = useState(false);
	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
		setValidationSetting("was-validated");
	};

	const handleEditEvent = (e) => {
		e.preventDefault();

		const eventNewData = {
			name: name.trim(),
			description: description.trim(),
			startDate,
			endDate,
			discountPercentage,
			image,
		};
		axios
			.put(`${server}/seller/edit-event/${eventId}`, eventNewData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data?.message || "Success");
				const eventData = res.data.eventData;
				setName(eventData?.name);
				setDescription(eventData?.description);
				setStartDate(
					new Date(eventData?.start_date).toISOString().split("T")[0]
				);
				setEndDate(new Date(eventData?.end_date).toISOString().split("T")[0]);
				setDiscountPercentage(eventData?.discount_percentage);
				setImageUrl(eventData?.images[0]?.url);
			})
			.catch((err) => toast.error(err.data?.message || "An error occurred"));
	};
	const handleDeleteEvent = () => {
		axios.defaults.withCredentials = true;

		axios
			.put(`${server}/seller/delete-event/${eventId}`, {
				withCredentials: true,
			})
			.then((res) => {
				navigate(-1);
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast.error(err.data?.message || "An error occurred"));
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

	useEffect(() => {
		axios
			.get(`${server}/seller/get-event-details/${eventId}`, {
				withCredentials: true,
			})
			.then((res) => {
				const eventData = res.data.eventsData;
				setName(eventData?.name);
				setDescription(eventData?.description);
				setTypeOfEvent(eventData?.type_of_event);
				setStartDate(
					new Date(eventData?.start_date).toISOString().split("T")[0]
				);
				setEndDate(new Date(eventData?.end_date).toISOString().split("T")[0]);
				setDiscountPercentage(eventData?.discount_percentage);
				setImageUrl(eventData?.images[0]?.url);
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<div>
			<div className="col-6 mb-3 mx-auto">
				<img className="w-100 rounded-4" src={imageUrl} alt="" />
			</div>
			<form
				noValidate
				onChange={handleFormChange}
				onSubmit={handleEditEvent}
				className={`${validationSetting} ${formClass}`}>
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Event Name
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={name}
							name="productName"
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<div class="invalid-feedback">Invalid</div>
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
							className="form-control"
							id="product-name"
							value={startDate}
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
							disabled={true}
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
				<div className="row">
					<label htmlFor="product-name" className={formLabelClass}>
						Discount Percentage
					</label>
					<div className={inputDivClass}>
						<input
							type="text"
							className="form-control"
							id="product-name"
							value={discountPercentage}
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
						/>
						<div className="invalid-feedback">Invalid</div>
					</div>
				</div>
				<div className="d-flex gap-3">
					<button
						disabled={!allowSubmission}
						type="submit"
						className={`w-100 btn btn-secondary text-white`}>
						Update Event Details
					</button>
					<button
						onClick={handleDeleteEvent}
						type="button"
						className={`btn-danger ${submitButtonClass}`}>
						Delete
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditSingleEventSeller;
