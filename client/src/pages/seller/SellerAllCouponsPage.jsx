import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useParams } from "react-router-dom";
import Icons from "../../assets/Icons";
import convertISOToDate from "../../utils/convertISOToDate";
import Pagination from "../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
const { eye, edit } = Icons;

const SellerAllCouponsPage = () => {
	const { shopId } = useParams();
	const [couponData, setCouponData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/get-all-coupons/${shopId}?page=${
					pagination.page || 1
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setCouponData(res.data?.couponData);
				setPagination(res.data.pagination);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.page]);
	return (
		<div>
			{loading && (
				<div className="min-vh-100 w-100 d-flex justify-content-center ">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			)}
			<Pagination pagination={pagination} setPagination={setPagination} />
			<section className="d-flex flex-column gap-2">
				{couponData.map((coupon) => (
					<div className="p-3 bg-white m-1 row rounded-4 align-items-center ">
						<section className="col-3">
							<p className="m-0">{coupon.name}</p>
							<p className="fw-bold m-0">{coupon.code}</p>
						</section>
						<section className="col-3">
							<p className="m-0">{coupon.status}</p>
							<p className="fw-bold m-0">{convertISOToDate(coupon.expires)}</p>
						</section>
						<section className="col-2">
							<p className="text-small text-secondary m-0">Min Amount</p>
							<p className="mb-0">{coupon.minAmount}</p>
						</section>
						<section className="col-2">
							<p className="text-small text-secondary m-0">Max Amount</p>
							<p className="m-0">{coupon.maxAmount}</p>
						</section>
						<section className="d-flex align-items-center justify-content-end  col-1 gap-3 ">
							<Link to={`${coupon._id}`}>
								<button className="btn btn-secondary text-white btn-sm">
									{edit}
								</button>
							</Link>
						</section>
					</div>
				))}
			</section>
		</div>
	);
};

export default SellerAllCouponsPage;
