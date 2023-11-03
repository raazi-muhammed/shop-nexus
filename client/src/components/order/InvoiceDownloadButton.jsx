import React, { useState, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import formatPrice from "../../utils/formatPrice";
import convertISOToDate from "../../utils/convertISOToDate";
const InvoiceDownloadButton = ({ orderDetails }) => {
	const invoicePdf = useRef();
	const [invoiceLoading, setInvoiceLoading] = useState(false);
	const handleInvoiceDownload = async () => {
		setInvoiceLoading(true);
		const salesReportContentElement = invoicePdf.current;
		const canvas = await html2canvas(salesReportContentElement, {
			scrollY: -window.scrollY,
		});
		const imageData = canvas.toDataURL("image/png");

		const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);
		pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
		pdf.save("sales-report.pdf");
		setInvoiceLoading(false);
	};

	return (
		<>
			<button
				disabled={invoiceLoading}
				onClick={handleInvoiceDownload}
				className="btn w-100 bg-primary-subtle text-primary btn-sm d-flex justify-content-center">
				<ClipLoader
					className="m-0 p-0 text-primary mx-auto my-auto me-1"
					loading={invoiceLoading}
					size={15}
					color="#342475"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
				<p>Download Invoice</p>
			</button>

			<div
				style={{ zIndex: -100, width: "45rem" }}
				className="bg-white position-fixed top-0 opacity-0">
				<section ref={invoicePdf} className="p-5">
					<section>
						<p className="h3">Shop Nexus Invoice</p>
					</section>
					<hr className="text-secondary" />
					<section className="mb-5">
						<p className="fw-bold m-0">From</p>
						<p>{orderDetails[0]?.orderItems[0]?.shop?.shopName}</p>

						<p>
							<span className="fw-bold">GSTIN Number: </span>
							{orderDetails[0]?.orderItems[0]?.shop?.GSTIN_Number}
						</p>
						<p className="fw-bold m-0">Address</p>
						<p className="m-0">{`${orderDetails[0]?.orderItems[0]?.shop?.address2}`}</p>
						<p className="m-0">{`${orderDetails[0]?.orderItems[0]?.shop?.address1}, ${orderDetails[0]?.orderItems[0]?.shop?.zipCode}`}</p>
					</section>
					<hr className="text-secondary" />
					<section className="row">
						<section className="col-4">
							<p className="fw-bold m-0">Order Id</p>
							<p>{orderDetails[0]?.orderId}</p>
							<p className="fw-bold m-0">Order Date</p>
							<p>{convertISOToDate(orderDetails[0]?.createdAt)}</p>
							<p className="fw-bold m-0">Invoice Date</p>
							<p>{convertISOToDate(new Date())}</p>
						</section>
						<section className="col-5">
							<p className="fw-bold m-0">Bill To</p>
							<p className="mb-0">{orderDetails[0]?.shop?.fullName}</p>
							<p className="mb-0">
								{orderDetails[0]?.shippingAddress?.phoneNumber}
							</p>
							<p className="fw-bold mt-3 m-0">Address</p>
							<p className="m-0">{`${orderDetails[0]?.shippingAddress?.address2}, ${orderDetails[0]?.shippingAddress?.address1}, ${orderDetails[0]?.shippingAddress?.pinCode}, ${orderDetails[0]?.shippingAddress?.city}, ${orderDetails[0]?.shippingAddress?.state}`}</p>

							<p className="fw-bold mt-3 m-0">Type</p>
							<p className="mb-2">
								{orderDetails[0]?.shippingAddress?.addressType}
							</p>
						</section>
						<section className="col-3">
							<p className="m-0 text-small">
								* Keep this invoice and manufacture box for warranty purposes
							</p>
						</section>
					</section>
					<hr className="text-secondary" />
					<section>
						<table className="table">
							<thead className="text-nowrap">
								<tr>
									<th>Products</th>

									<th>Qty</th>
									<th>Unit About</th>
									<th>Total Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{orderDetails[0]?.orderItems[0]?.product.name}</td>
									<td>{orderDetails[0]?.orderItems[0]?.quantity}</td>
									<td>
										{formatPrice(
											orderDetails[0]?.orderItems[0]?.product.discount_price /
												orderDetails[0]?.orderItems[0]?.quantity
										)}
									</td>
									<td>
										{formatPrice(
											orderDetails[0]?.orderItems[0]?.product.discount_price
										)}
									</td>
								</tr>
							</tbody>
							<tfoot className="border-top border-bottom p border-black fw-bold text-nowrap">
								<tr>
									<td>Total</td>

									<td>{orderDetails[0]?.orderItems[0]?.quantity}</td>
									<td>
										{formatPrice(
											orderDetails[0]?.orderItems[0]?.product.discount_price /
												orderDetails[0]?.orderItems[0]?.quantity
										)}
									</td>
									<td>
										{formatPrice(
											orderDetails[0]?.orderItems[0]?.product.discount_price
										)}
									</td>
								</tr>
							</tfoot>
						</table>
					</section>
					<section className="mb-5 pb-5">
						<p className="h5 fw-bold text-end pe-4">
							<span className="fw-normal">Grand Total: </span>
							{formatPrice(
								orderDetails[0]?.orderItems[0]?.product.discount_price
							)}
						</p>
					</section>
					<section className="mt-5">
						<hr className="mt-5" />
						<p className="text-small opacity-50">
							Returns Policy: At Shop Nexus we try to deliver perfectly each and
							every time. But in the off-chance that you need to return the
							item, please do so with the original Brand box/price tag, original
							packing and invoice without which it will be really difficult for
							us to act on your request. Please help us in helping you. Terms
							and conditions apply. The goods sold as are intended for end user
							consumption and not for re-sale.
						</p>
					</section>
					<hr />
				</section>
			</div>
		</>
	);
};

export default InvoiceDownloadButton;
