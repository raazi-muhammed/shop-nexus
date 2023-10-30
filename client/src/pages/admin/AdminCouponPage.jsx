import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import { Link, useParams } from "react-router-dom";
import Icons from "../../assets/Icons";
import convertISOToDate from "../../utils/convertISOToDate";
import Pagination from "../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import { getCouponTypeByKey } from "../../constants/couponTypeConstants";
import formatPrice from "../../utils/formatPrice";
import toast from "react-hot-toast";
import { getCouponStateByKey } from "../../constants/couponStateConstants";
const { eye, edit } = Icons;

const AdminCouponsPage = () => {
	const [couponData, setCouponData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/admin/get-all-coupons?page=${pagination.page || 1}`, {
				withCredentials: true,
			})
			.then((res) => {
				setCouponData(res.data?.couponData);
				setPagination(res.data.pagination);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.page, refresh]);

	const handleChangeCouponState = (couponId, state) => {
		const formData = {
			couponId,
			status: state,
		};
		axios
			.patch(`${server}/admin/change-coupon-state`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				toast.success(res.data?.message || "Success");
			})
			.catch((err) =>
				toast.error(err.response?.data?.message || "An error occurred")
			)
			.finally(() => setRefresh(!refresh));
	};

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
			<section className="d-flex flex-column flex-nowrap  gap-2">
				{couponData.map((coupon) => (
					<div
						key={coupon.code}
						className="p-3 bg-white m-1 row rounded-4 align-items-center ">
						<section className="col">
							<p className="m-0 text-small fw-bold">
								{getCouponTypeByKey(coupon.type)}
							</p>
							<p className="m-0 text-small">{coupon.name}</p>
							<p className="fw-bold m-0">{coupon.code}</p>
						</section>
						<section className="col">
							<p className="m-0">{getCouponStateByKey(coupon.status)}</p>
							<p className="fw-bold m-0">{convertISOToDate(coupon.expires)}</p>
						</section>
						<section className="col-2">
							<p className="text-small text-secondary m-0">Min Amount</p>
							<p className="mb-0">{formatPrice(coupon.minAmount)}</p>
							<p className="text-small text-secondary m-0">Max Amount</p>
							<p className="m-0 text-nowrap overflow-ellipsis">
								{formatPrice(coupon.maxAmount)}
							</p>
						</section>
						<section className="col-3 ps-3">
							<button
								onClick={() => handleChangeCouponState(coupon._id, "ACTIVE")}
								className="btn bg-success-subtle text-success  btn-sm w-100">
								Approve
							</button>
							<button
								onClick={() =>
									handleChangeCouponState(coupon._id, "NOT_APPROVED")
								}
								className="btn bg-danger-subtle text-danger btn-sm mt-2 w-100">
								Not Approved
							</button>
						</section>
					</div>
				))}
			</section>
		</div>
	);
};

export default AdminCouponsPage;
