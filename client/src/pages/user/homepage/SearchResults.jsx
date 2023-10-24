import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import server from "../../../server";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductSearchResult from "../../../components/product/ProductSearchResult";

const SearchResults = () => {
	const searchOptions = useSelector(
		(state) => state.searchOptions.searchOptions
	);

	const [searchResults, setSearchResults] = useState([]);
	const [searchUrl, setSearchUrl] = useState("");

	useEffect(() => {
		let newSetSearchUrl = "";
		if (searchOptions.searchTerm) {
			newSetSearchUrl += `&searchTerm=${searchOptions.searchTerm}`;
		}
		if (searchOptions.category) {
			newSetSearchUrl += `&category=${searchOptions.category}`;
		}

		setSearchUrl(newSetSearchUrl);
	}, [searchOptions]);

	useEffect(() => {
		axios
			.get(`${server}/products/search-products?${searchUrl}`)
			.then((res) => {
				console.log(res);
				setSearchResults(res.data.products);
			})
			.catch((err) => console.log(err));
	}, [searchUrl]);
	return (
		<main className="vw-100 min-vh-100">
			<div className="w-100 container container-xxl  ">
				<div className="row">
					<p>Search OPTIONS{JSON.stringify(searchOptions)}</p>
					<aside className="col-3 bg-white p-4 rounded-4">
						<section>Filter Products</section>
					</aside>
					<section className="col-9">
						{searchResults?.map((product) => (
							<ProductSearchResult productDetails={product} />
						))}
					</section>
				</div>
			</div>
		</main>
	);
};

export default SearchResults;
