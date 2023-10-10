import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";

const SellerEditSingleProductPage = () => {
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
			.put(`${server}/products/edit-product/${productId}`, formData)
			.then((res) => {
				toast.success(res.data?.message);
				setRefresh(!refresh);
			})
			.catch((err) => console.log(err.response.data.message));
	};

	/* For Deleting(soft) Product */
	const handleDelete = (e) => {
		axios
			.delete(`${server}/products/delete-product/${productId}`)
			.then((res) => toast.success(res.data?.message))
			.catch((err) => console.log(err));
	};

	const handleRemoveItem = (index) => {
		console.log(index);
		axios
			.put(`${server}/products/delete-product-image/${productId}`, {
				index,
			})
			.then((res) => {
				toast.success(res.data.message);
				setRefresh(!refresh);
			})
			.catch((err) => toast.error(err.data.data.message));
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
					images,
				} = res.data?.productDetails[0];
				setData(res.data);
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
				<section className="d-flex overflow-auto gap-3 my-3">
					{imagesToDisplay.map((e, i) => (
						<div className="col-3">
							<img className="w-100 rounded-4" src={e.url} alt="" />
							<button
								className="btn btn-danger btn-sm mt-2 w-100"
								onClick={(event) => handleRemoveItem(e.url)}>
								Remove
							</button>
						</div>
					))}
				</section>
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

				<div className="row gap-3 m-1">
					<button type="submit" className="col btn btn-primary">
						Edit Product
					</button>
					<button className="col btn btn-danger" onClick={handleDelete}>
						Delete Product
					</button>
				</div>
			</form>
		</div>
	);
};

export default SellerEditSingleProductPage;
