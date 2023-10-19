import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useParams } from "react-router-dom";
import Icons from "../../assets/Icons";
import convertISOToDate from "../../utils/convertISOToDate";
import Pagination from "../../components/Pagination";
const { eye, edit } = Icons;

const AdminCouponsPage = () => {
	const [couponData, setCouponData] = useState([]);
	const [pagination, setPagination] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/admin/get-all-coupons?page=${pagination.page || 1}`, {
				withCredentials: true,
			})
			.then((res) => {
				setCouponData(res.data?.couponData);
				setPagination(res.data.pagination);
			})
			.catch((err) => console.log(err));
	}, [pagination.page]);
	return (
		<div>
			<Pagination pagination={pagination} setPagination={setPagination} />
			<section className="d-flex flex-column flex-nowrap  gap-2">
				{couponData.map((coupon) => (
					<div className="p-3 bg-white m-1 row rounded-4 align-items-center ">
						<section className="col">
							<p className="m-0">{coupon.name}</p>
							<p className="fw-bold m-0">{coupon.code}</p>
						</section>
						<section className="col">
							<p className="m-0">{coupon.status}</p>
							<p className="fw-bold m-0">{convertISOToDate(coupon.expires)}</p>
						</section>
						<section className="col">
							<p className="text-small text-secondary m-0">Min Amount</p>
							<p className="mb-0">{coupon.minAmount}</p>
						</section>
						<section className="col">
							<p className="text-small text-secondary m-0">Max Amount</p>
							<p className="m-0">{coupon.maxAmount}</p>
						</section>
						{/* <section className="col-1">
							<Link to={`${coupon._id}`}>
								<button className="btn btn-secondary text-white btn-sm">
									{edit}
								</button>
							</Link>
						</section> */}
					</div>
				))}
			</section>
		</div>
	);
};

export default AdminCouponsPage;
