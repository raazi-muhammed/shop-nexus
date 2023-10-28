import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import server from "../../../server";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ProductSearchResult from "../../../components/product/ProductSearchResult";
import { debounce } from "lodash";
import RatingStar from "../../../components/product/RatingStar";
import ClipLoader from "react-spinners/ClipLoader";
import { setCategoryOptions } from "../../../app/feature/search/searchOptionsSlice";
import categoriesConstants from "../../../constants/categoriesConstants";

const SearchResults = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const searchOptions = useSelector(
		(state) => state.searchOptions.searchOptions
	);

	const [searchResults, setSearchResults] = useState([]);
	const [searchUrl, setSearchUrl] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [rating, setRating] = useState("");

	useEffect(() => {
		let newSetSearchUrl = "";
		if (searchOptions.searchTerm) {
			newSetSearchUrl += `&searchTerm=${searchOptions.searchTerm}`;
		}
		if (searchOptions.category) {
			newSetSearchUrl += `&category=${searchOptions.category}`;
		}
		if (minPrice) {
			newSetSearchUrl += `&minPrice=${minPrice}`;
		}
		if (maxPrice) {
			newSetSearchUrl += `&maxPrice=${maxPrice}`;
		}
		if (rating) {
			newSetSearchUrl += `&rating=${rating}`;
		}
		console.log(newSetSearchUrl);

		setSearchUrl(newSetSearchUrl);
	}, [searchOptions, minPrice, maxPrice, rating]);

	useEffect(
		debounce(() => {
			setLoading(true);
			axios
				.get(`${server}/products/search-products?${searchUrl}`)
				.then((res) => {
					setSearchResults(res.data.products);
				})
				.catch((err) => console.log(err))
				.finally(() => setLoading(false));
		}, 1000),
		[searchUrl]
	);
	const categoryChange = (e) => {
		navigate(`/search`);
		dispatch(setCategoryOptions(e.target.value));
	};

	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row pt-3">
					<aside className="col-3 bg-white p-4 rounded-4 h-100">
						<section className="mt-2">
							<label className="visually-hidden " htmlFor="categorySelect">
								Select a Category:
							</label>
							<select
								onChange={categoryChange}
								className="w-100 form-select form-select-sm bg-light px-3"
								id="categorySelect">
								<option value="">Select Category</option>
								{categoriesConstants.map((e) => (
									<option key={e.key} value={e.key}>
										{e.value}
									</option>
								))}
							</select>
						</section>
						<hr className="text-light" />
						<section>
							<div className="d-flex align-items-center justify-content-between ">
								<p className="text-primary fw-bold  text-small m-0">Rating</p>
								<button
									className="text-small text-secondary btn-sm btn m-0 py-0"
									onClick={(e) => {
										setRating("");
									}}>
									Clear
								</button>
							</div>
							<div className="d-flex flex-column mb-2">
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold d-flex align-items-center"
									onClick={(e) => {
										setRating(2);
									}}>
									<RatingStar rating={2} />
									<p className="p-2 pt-2 mt-1 m-0">& Up</p>
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold d-flex align-items-center"
									onClick={(e) => {
										setRating(4);
									}}>
									<RatingStar rating={4} />
									<p className="p-2 pt-2 mt-1 m-0">& Up</p>
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold d-flex align-items-center"
									onClick={(e) => {
										setRating(6);
									}}>
									<RatingStar rating={6} />
									<p className="p-2 pt-2 mt-1 m-0">& Up</p>
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold d-flex align-items-center"
									onClick={(e) => {
										setRating(8);
									}}>
									<RatingStar rating={8} />
									<p className="p-2 pt-2 mt-1 m-0">& Up</p>
								</button>
							</div>
						</section>
						<hr className="text-light" />
						<section>
							<div className="d-flex align-items-center justify-content-between ">
								<p className="text-primary fw-bold  text-small m-0">Price</p>
								<button
									className="text-small text-secondary btn-sm btn m-0 py-0"
									onClick={(e) => {
										setMinPrice("");
										setMaxPrice("");
									}}>
									Clear
								</button>
							</div>
							<div className="d-flex flex-column mb-2">
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold"
									onClick={(e) => {
										setMinPrice("");
										setMaxPrice(10000);
									}}>
									Under 10,000
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold"
									onClick={(e) => {
										setMinPrice(10000);
										setMaxPrice(20000);
									}}>
									10,000 - 20,000
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold"
									onClick={(e) => {
										setMinPrice(20000);
										setMaxPrice(50000);
									}}>
									20,000 - 50,000
								</button>
								<button
									className="btn-sm btn p-0 m-0 text-start fw-bold"
									onClick={(e) => {
										setMinPrice(50000);
										setMaxPrice("");
									}}>
									Above 50,000
								</button>
							</div>
							<section className="row">
								<div class="col-6">
									<label for="exampleInputEmail1" class="form-label mb-1">
										Min Price
									</label>
									<input
										type="Number"
										value={minPrice}
										onChange={(e) => setMinPrice(e.target.value)}
										class="form-control"
										id="exampleInputEmail1"
									/>
								</div>
								<div class="col-6">
									<label for="exampleInputEmail1" class="form-label mb-1">
										Max Price
									</label>
									<input
										type="Number"
										value={maxPrice}
										onChange={(e) => setMaxPrice(e.target.value)}
										class="form-control"
										id="exampleInputEmail1"
									/>
								</div>
							</section>
						</section>
					</aside>

					{loading ? (
						<ClipLoader
							className="m-0 p-0 text-primary mx-auto mt-5 "
							loading={loading}
							size={30}
							color="primary"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					) : (
						<section className="col-9">
							{searchResults.length === 0 && (
								<p className="text-secondary text-center mt-5">
									No Search Results
								</p>
							)}
							{searchResults?.map((product) => (
								<ProductSearchResult productDetails={product} />
							))}
						</section>
					)}
				</div>
			</div>
		</main>
	);
};

export default SearchResults;
