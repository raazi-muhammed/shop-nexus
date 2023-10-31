import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useParams } from "react-router-dom";
import Icons from "../../assets/Icons";
import convertISOToDate from "../../utils/convertISOToDate";
import Pagination from "../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import Sorting from "../../components/Sorting";
import formatPrice from "../../utils/formatPrice";
import { getCouponTypeByKey } from "../../constants/couponTypeConstants";
import { getCouponStateByKey } from "../../constants/couponStateConstants";
import RefreshButton from "../../components/RefreshButton";
const { eye, edit } = Icons;

const SellerAllCouponsPage = () => {
	const { shopId } = useParams();
	const [couponData, setCouponData] = useState([]);
	const [refresh, setRefresh] = useState(true);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "createdAt", title: "Date" },
			{ value: "minAmount", title: "Min Amount" },
			{ value: "maxAmount", title: "Max Amount" },
			{ value: "discountPercentage", title: "Discount Percentage" },
		],
	});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/get-all-coupons/${shopId}?page=${
					pagination.page || 1
				}&sort=${sortOptions.sortBy}`,
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
	}, [refresh, pagination.page, sortOptions]);
	return (
		<div>
			{loading ? (
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
			) : (
				<>
					<section className="d-flex justify-content-end gap-3 ">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<Sorting
							sortOptions={sortOptions}
							setSortOptions={setSortOptions}
						/>
						<Pagination pagination={pagination} setPagination={setPagination} />
					</section>
					<section className="d-flex flex-column gap-2">
						{couponData.map((coupon) => (
							<div
								key={coupon.code}
								className="p-3 bg-white m-1 row rounded-4 align-items-center ">
								<section className="col-4">
									<p className="m-0 text-small fw-bold">
										{getCouponTypeByKey(coupon.type)}
									</p>
									<p className="m-0 text-small">{coupon.name}</p>
									<p className="fw-bold m-0">{coupon.code}</p>
								</section>
								<section className="col-3">
									<p className="m-0">{getCouponStateByKey(coupon.status)}</p>
									<p className="fw-bold m-0">
										{convertISOToDate(coupon.expires)}
									</p>
								</section>
								<section className="col-2">
									<p className="text-small text-secondary m-0">Min Amount</p>
									<p className="mb-0">{formatPrice(coupon.minAmount)}</p>
								</section>
								<section className="col-2">
									<p className="text-small text-secondary m-0">Max Amount</p>
									<p className="m-0 text-nowrap overflow-ellipsis">
										{formatPrice(coupon.maxAmount)}
									</p>
								</section>
								<section className="d-flex align-items-center justify-content-end col-1 gap-3 ">
									<Link to={`${coupon._id}`}>
										<button className="btn btn-secondary text-white btn-sm">
											{edit}
										</button>
									</Link>
								</section>
							</div>
						))}
					</section>
				</>
			)}
		</div>
	);
};

export default SellerAllCouponsPage;
