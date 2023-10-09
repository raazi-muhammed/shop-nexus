import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { useParams, useSearchParams } from "react-router-dom";
import RatingStar from "../../components/RatingStar";
import Icons from "../../assets/Icons";
import NavComponent from "../../components/NavComponent";
import toast from "react-hot-toast";
const { heart, cart } = Icons;

const SingleProductPage = () => {
	const [imgSelect, setImgSelect] = useState(0);
	const [productData, setProductData] = useState({ images: [] });
	const { id } = useParams();
	const navItems = [
		{ name: "Details", link: "#" },
		{ name: "Reviews", link: "#" },
		{ name: "About Seller", link: "#" },
	];
	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${id}`)
			.then((res) => {
				setProductData(res.data.productDetails[0]);
			})
			.catch((err) => toast.error("Loading failed" + err));
	}, []);

	return (
		<main>
			<section className="row p-4">
				<section className="col-6">
					<img
						className="w-100 rounded-4"
						src={productData?.images[imgSelect]?.url}
						alt=""
						srcSet=""
					/>
					<section className="d-flex gap-3 justify-content-center mt-4">
						{productData?.images.map((e, i) => (
							<img
								key={i}
								className="rounded-4"
								style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
								src={productData?.images[i]?.url}
								alt=""
								onClick={(e) => setImgSelect(i)}
								srcSet=""
							/>
						))}
					</section>
				</section>
				<section className="col-6 px-4">
					<h3>{productData.name}</h3>
					<p className="text-secondary fw-bold mb-2">{productData.category}</p>
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
					</section>
				</section>
			</section>
			{/* ------------------------------------------------------------------  */}
			<section className="bg-white p-4">
				<NavComponent className="justify-content-center " navItems={navItems} />
				<section className="p-4">
					<p className="h4">{productData.name}</p>
					<p className="text-small">{productData.description}</p>
				</section>
			</section>
		</main>
	);
};

export default SingleProductPage;
