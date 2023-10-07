import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { useParams, useSearchParams } from "react-router-dom";
import RatingStar from "../../components/RatingStar";
import Icons from "../../assets/Icons";
const { heart, cart } = Icons;

const SingleProductPage = () => {
	const [imgSelect, setImgSelect] = useState(0);
	const [productData, setProductData] = useState({ image_Url: [] });
	const { id } = useParams();

	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${id}`)
			.then((product) => setProductData(product.data[0]));
	}, []);

	return (
		<main>
			<section className="row p-4">
				<section className="col-6">
					<img
						className="w-100 rounded-4"
						src={productData?.image_Url[imgSelect]?.url}
						alt=""
						srcset=""
					/>
					<section className="d-flex gap-3 justify-content-center mt-4">
						{productData?.image_Url.map((e, i) => (
							<img
								className="rounded-4"
								style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
								src={productData?.image_Url[i]?.url}
								alt=""
								onClick={(e) => setImgSelect(i)}
								srcset=""
							/>
						))}
					</section>
				</section>
				<section className="col-6 px-4">
					<h3>{productData.name}</h3>
					<p className="text-small">{productData.description}</p>
					<div className="d-flex align-items-center  gap-2 mb-3">
						<RatingStar rating={productData.rating} />
						<p className="text-small mt-2 m-0">{`${productData.total_sell} Sold`}</p>
					</div>
					<div>
						<p className="h4 mb-0 fw-bold text-primary">
							${productData.discount_price}
						</p>
					</div>
					<section className="my-3 d-flex gap-2">
						<button className="btn btn-sm btn-primary d-flex gap-2 align-items-center">
							{cart} Add to Cart
						</button>
						<button className="btn btn-sm btn-secondary text-white">
							{heart} Add to Wishlist
						</button>
					</section>

					<section>
						<p className="text-primary fw-bold">About Seller</p>
						<section className="d-flex gap-4">
							<img
								className="rounded-circle "
								style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
								src={productData.shop?.shop_avatar?.url}
								alt=""
								srcset=""
							/>

							<div className="">
								<p className="h4 fw-bold text-primary">
									{productData.shop?.name}
								</p>
								<p>{`${productData.shop?.ratings} Ratings`}</p>
							</div>
						</section>
						<p>{JSON.stringify(productData)}</p>
					</section>
				</section>
			</section>
		</main>
	);
};

export default SingleProductPage;
