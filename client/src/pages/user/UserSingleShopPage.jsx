import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";
import ProductCartMain from "../../components/product/ProductCartMain";

const UserSingleShopPage = () => {
	const { id } = useParams();
	const [data, setData] = useState([]);
	const [productData, setProductData] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/seller/get-shop-details/${id}`)
			.then((res) => {
				setData(res.data.data);
				axios
					.get(`${server}/products/get-products-from-shop/${res.data.data._id}`)
					.then((res) => {
						setProductData(res.data.data);
					})
					.catch((err) =>
						toast.error(err.response.data.message || "Loading Failed")
					);
			})
			.catch((err) =>
				toast.error(err.response?.data?.message || "Failed to Load")
			);
	}, []);
	return (
		<main className="vw-100 min-vh-100 pt-4">
			<div className="w-100 container container-xl ">
				<section>
					<section className="mx-4">
						<img
							className="rounded-circle"
							style={{ width: "4.5rem" }}
							src={data.image?.url}
							alt=""
						/>
						<h3>{data.shopName}</h3>
						<p className="text-secondary mb-0"> {data.address1}</p>
						<p className="text-sm">{data.email}</p>
					</section>

					<hr className="m-3 text-secondary" />
					<section className={`d-flex`}>
						{productData.map((product) => (
							<ProductCartMain
								key={product._id}
								productId={product._id}
								price={product.price}
								rating={product.rating}
								name={product.name}
								sold={product.total_sell}
								shopName={product.shop.name}
								imgUrl={product.images[0]?.url}
								discount_price={product.discount_price}
							/>
						))}
					</section>
				</section>
			</div>
		</main>
	);
};

export default UserSingleShopPage;
