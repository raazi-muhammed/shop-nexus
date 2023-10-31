import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import formatPrice from "../../../utils/formatPrice";
import convertISOToDate from "../../../utils/convertISOToDate";
import toast from "react-hot-toast";
import RefreshButton from "../../../components/RefreshButton";
import Sorting from "../../../components/Sorting";
import Pagination from "../../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";

const UserWallet = () => {
	const [transactions, setTransactions] = useState();
	const [balanceAmount, setBalanceAmount] = useState();
	const [amountToAdd, setAmountToAdd] = useState(0);
	const [allowSubmission, setAllowSubmission] = useState(false);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "amount", title: "Price" },
			{ value: "createdAt", title: "Date" },
		],
	});

	useEffect(() => {
		try {
			if (amountToAdd < 0) setAllowSubmission(false);
			else setAllowSubmission(true);
		} catch (error) {
			setAllowSubmission(false);
		}
	}, [amountToAdd]);

	const handleFormChange = (e) => {
		setAllowSubmission(e.currentTarget.checkValidity());
	};

	const handleAddAmount = (e) => {
		e.preventDefault();

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onerror = () => toast.error("An error with RazorPay");
		script.onload = async () => {
			try {
				const result = await axios.post(
					`${server}/payment/create-razorpay-order`,
					{
						amount: amountToAdd,
					}
				);

				const { amount, id: order_id, currency } = result.data.order;
				const {
					data: { key: razorpayKey },
				} = await axios.get(`${server}/payment/get-razorpay-key`);

				const options = {
					key: razorpayKey,
					amount: amount.toString(),
					currency: currency,
					order_id,
					name: "Shop Nexus",
					handler: async (res) => {
						const paymentInfo = {
							type: "Razorpay",
							status: "Received",
							details: res,
						};
						const eventData = {
							name: "Payment Successful",
							details: `Razorpay Payment Id: ${res.razorpay_payment_id}`,
						};
						axios
							.patch(
								`${server}/user/change-wallet-balance`,
								{
									amountToAdd,
									description: `Added ${amountToAdd} via Razorpay`,
								},
								{ withCredentials: true }
							)
							.then((res) => {
								setRefresh(!refresh);
							});
					},
				};
				const paymentObject = new window.Razorpay(options);
				paymentObject.open();
			} catch (error) {
				toast.error(error.message || "An error ocurred");
			}
		};
		document.body.appendChild(script);
	};

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/user/get-wallet-details?page=${pagination?.page || 1}&sort=${
					sortOptions.sortBy
				}`,
				{ withCredentials: true }
			)
			.then((res) => {
				setTransactions(res.data.transactions);
				setBalanceAmount(res.data.balance);
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
					<div class="dropdown">
						<button
							type="button"
							class="btn btn-sm btn-primary dropdown-toggle"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							data-bs-auto-close="outside">
							Add Money
						</button>
						<form
							noValidate
							onChange={handleFormChange}
							onSubmit={handleAddAmount}
							id="stock-form"
							className="dropdown-menu p-4 was-validated">
							<div className="mb-3">
								<label
									htmlFor="exampleDropdownFormPassword2"
									className="form-label">
									Updated Stock
								</label>
								<input
									value={amountToAdd}
									type="text"
									className="form-control"
									id="exampleDropdownFormPassword2"
									onChange={(e) => {
										setAmountToAdd(e.target.value);
									}}
									pattern="^[0-9]\d*$"
									required
								/>
								<div className="invalid-feedback">Invalid</div>
							</div>
							<section className="d-flex gap-1">
								<button
									type="button"
									onClick={(e) => setAmountToAdd(Number(amountToAdd) + 100)}
									className="btn btn-sm btn-secondary text-white">
									+100
								</button>
								<button
									type="button"
									onClick={(e) => {
										setAmountToAdd(Number(amountToAdd) + 1000);
									}}
									className="btn btn-sm btn-secondary text-white">
									+1000
								</button>
							</section>
							<button
								disabled={!allowSubmission}
								type="submit"
								className="mt-3 btn btn-primary btn-sm">
								Add via Razorpay
							</button>
						</form>
					</div>
					<section className="m-0  bg-light p-4 rounded-4">
						<p className="mb-1 text-secondary">Wallet Balance</p>
						<p className="m-0 h3 text-primary">
							{formatPrice(balanceAmount || "0")}
						</p>
					</section>
					<section className="ms-2">
						<div className="d-flex justify-content-between">
							<p className="mt-4 fw-bold text-secondary">Transactions</p>
							<section className="d-flex justify-content-end gap-3 pb-0 mt-4">
								<RefreshButton refresh={refresh} setRefresh={setRefresh} />
								<Sorting
									sortOptions={sortOptions}
									setSortOptions={setSortOptions}
								/>
								<Pagination
									pagination={pagination}
									setPagination={setPagination}
								/>
							</section>
						</div>
						{transactions?.map((event, i) => (
							<div
								key={i}
								className="p-3 bg-white mb-3 row rounded-4 align-items-center ">
								<section className="col">
									<p className="text-small text-secondary m-0">Details</p>
									<p className="mb-0">
										{convertISOToDate(event.createdAt, true)}
									</p>
									<p className="mb-0 text-small">{event.description}</p>
								</section>
								<section className="col text-end">
									<p className="text-small  text-secondary m-0">Amount</p>

									{event.amount < 0 ? (
										<p className="mb-0 text-danger fw-bold">
											-{formatPrice(event.amount * -1)}
										</p>
									) : (
										<p className="mb-0 text-success fw-bold">
											+{formatPrice(event.amount)}
										</p>
									)}
								</section>
							</div>
						))}
					</section>
				</>
			)}
		</div>
	);
};

export default UserWallet;
