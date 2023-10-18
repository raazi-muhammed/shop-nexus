import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const SellerStockManagement = () => {
	const [loading, setLoading] = useState(false);
	const { shopId } = useParams();
	const [data, setData] = useState([{ images: [{ url: "" }] }]);
	const [updatedStock, setUpdatedStock] = useState(0);
	const [refresh, setRefresh] = useState(true);

	const [allowSubmission, setAllowSubmission] = useState(false);
	useEffect(() => {
		try {
			if (updatedStock < 0) setAllowSubmission(false);
			else setAllowSubmission(true);
		} catch (error) {
			setAllowSubmission(false);
		}
	}, [updatedStock]);

	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
	};

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/get-products-from-shop/${shopId}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data.data);
			})
			.catch((err) => toast.error(err.response.data.message))
			.finally(() => {
				setLoading(false);
			});
	}, [refresh]);

	const handleSubmit = async (e, productId) => {
		e.preventDefault();
		setLoading(true);
		setAllowSubmission(false);
		const data = {
			stock: updatedStock,
			productId,
		};

		axios
			.patch(`${server}/seller/change-stock-value`, data, {
				withCredentials: true,
			})
			.then((res) => {
				setRefresh(!refresh);
				toast.success(res.data?.message || "Success");
			})
			.catch((err) => toast)
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="d-flex flex-column gap-2">
			<section className="row py-0 mb-0 p-5 text-secondary fw-bold">
				<p className="col-6 m-0 ">Product Details</p>
				<p className="col-3 m-0">Info</p>
				<p className="col-2 m-0">Price</p>
			</section>
			{!data[0]?.name ? (
				<ClipLoader
					className="m-0 p-0 text-primary mx-auto mt-5 "
					loading={loading}
					size={30}
					color="primary"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			) : (
				<>
					{data.map((product, i) => (
						<div
							key={i}
							className="ps-0 p-3 bg-white m-1 row rounded-4 align-items-center">
							<section className="col-6 d-flex align-items-center ">
								<img
									className="rounded-2"
									style={{ width: "5rem", height: "5rem" }}
									src={product.images[0].url}
									alt=""
									srcSet=""
								/>
								<div className="ms-2 align-items-center">
									<p className="text-small m-0">{`Id: ${product._id}`}</p>
									<p className="m-0">{product.name}</p>
									<p className="text-sm text-secondary fw-bold  m-0">{`$${product.price}`}</p>
								</div>
							</section>
							<section className="col-3">
								<p className="text-small text-secondary m-0">Current Stock</p>
								<p className="fw-bold">{`${product.stock} in Stock`}</p>
							</section>
							<section className="col-3">
								<div className="dropdown">
									<button
										onClick={() => setUpdatedStock(product.stock)}
										type="button"
										className="btn btn-primary btn-sm dropdown-toggle"
										data-bs-toggle="dropdown"
										aria-expanded="false"
										data-bs-auto-close="outside">
										Update Stock
									</button>
									<form
										noValidate
										onChange={handleFormChange}
										onSubmit={(e) => handleSubmit(e, product._id)}
										id="stock-form"
										className="dropdown-menu p-4 was-validated">
										<div className="mb-3">
											<label
												htmlFor="exampleDropdownFormPassword2"
												className="form-label">
												Updated Stock
											</label>
											<input
												value={updatedStock}
												type="text"
												className="form-control"
												id="exampleDropdownFormPassword2"
												onChange={(e) => {
													setUpdatedStock(e.target.value);
												}}
												pattern="^[0-9]\d*$"
												required
											/>
											<div className="invalid-feedback">Invalid</div>
										</div>
										<section className="d-flex gap-1">
											<button
												type="button"
												onClick={(e) => {
													setUpdatedStock(Number(updatedStock) - 100);
												}}
												className="btn btn-sm btn-secondary text-white">
												-100
											</button>
											<button
												type="button"
												onClick={(e) =>
													setUpdatedStock(Number(updatedStock) + 100)
												}
												className="btn btn-sm btn-secondary text-white">
												+100
											</button>
											<button
												type="button"
												onClick={(e) => {
													setUpdatedStock(Number(updatedStock) + 1000);
												}}
												className="btn btn-sm btn-secondary text-white">
												+1000
											</button>
										</section>
										<button
											disabled={!allowSubmission}
											type="submit"
											className="mt-3 btn btn-primary btn-sm">
											Update
										</button>
									</form>
								</div>
							</section>
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default SellerStockManagement;
