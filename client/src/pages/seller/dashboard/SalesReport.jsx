import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import server from "../../../server";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ClipLoader from "react-spinners/ClipLoader";
import convertISOToDate from "../../../utils/convertISOToDate";
import tableToJson from "../../../utils/tableToJson";
import exportFromJSON from "export-from-json";

const SalesReport = () => {
	const [loading, setLoading] = useState(false);
	const [pdfDownloading, setPdfDownloading] = useState(false);
	const [fileDownloading, setFileDownloading] = useState(false);
	const [salesReportData, setSalesReportData] = useState([]);
	const reportHTML = useRef();
	const reportTable = useRef();
	const [dataFromDisplay, setDataFromDisplay] = useState("");
	const [dataFrom, setDataFrom] = useState("THIS_YEAR");
	const dataFromOptions = [
		{
			key: "ALL_TIME",
			value: "All Time",
		},
		{
			key: "THIS_YEAR",
			value: "This Year",
		},
		{
			key: "THIS_MONTH",
			value: "This Month",
		},
	];

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/seller/get-sales-report?dataFrom=${dataFrom}`, {
				withCredentials: true,
			})
			.then((res) => {
				setSalesReportData(res.data.salesReport);
				setDataFromDisplay(res.data.dataFromDisplay);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [dataFrom]);

	const handleDownloadReportPDF = async () => {
		setFileDownloading(true);
		const salesReportContentElement = reportHTML.current;
		const canvas = await html2canvas(salesReportContentElement, {
			scrollY: -window.scrollY,
		});
		const imageData = canvas.toDataURL("image/png");

		const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);
		pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
		pdf.save("sales-report.pdf");
		setFileDownloading(false);
	};
	const handleDownloadReportExcel = async () => {
		setFileDownloading(true);
		const salesReportData = tableToJson(reportTable.current);

		const fileName = "Sales-Report";
		const exportType = exportFromJSON.types.csv;

		exportFromJSON({
			data: salesReportData,
			fileName,
			exportType,
			extension: "xls",
		});
		setFileDownloading(false);
	};
	const handleDownloadReportJson = async () => {
		setFileDownloading(true);
		const salesReportData = tableToJson(reportTable.current);
		const fileName = "Sales-Report";
		const exportType = exportFromJSON.types.json;
		exportFromJSON({ data: salesReportData, fileName, exportType });
		setFileDownloading(false);
	};
	const handleDownloadReportCSV = async () => {
		setFileDownloading(true);
		const salesReportData = tableToJson(reportTable.current);
		const fileName = "Sales-Report";
		const exportType = exportFromJSON.types.csv;
		exportFromJSON({ data: salesReportData, fileName, exportType });
		setFileDownloading(false);
	};

	return (
		<div className="w-100">
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
					<section className="d-flex justify-content-end gap-3 ms-auto mb-4">
						<ClipLoader
							className="m-0 p-0 text-primary mx-auto my-auto me-1"
							loading={fileDownloading}
							size={15}
							color="#342475"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
						<div class="btn-group" role="group">
							<button
								type="button"
								onClick={() => setPdfDownloading(true)}
								class="btn btn-light btn-sm dropdown-toggle px-3"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								Download
							</button>
							<ul
								onClick={() => setPdfDownloading(false)}
								class="dropdown-menu p-2">
								<li>
									<button
										disabled={fileDownloading}
										className="btn btn-light btn-sm text-start w-100 mb-2 text-nowrap"
										onClick={() => {
											handleDownloadReportPDF();
										}}>
										as PDF
									</button>
								</li>
								<li>
									<button
										disabled={fileDownloading}
										className="btn btn-light btn-sm text-start w-100 mb-2 text-nowrap"
										onClick={handleDownloadReportExcel}>
										as EXCEL
									</button>
								</li>
								<li>
									<button
										disabled={fileDownloading}
										className="btn btn-light btn-sm text-start w-100 mb-2 text-nowrap"
										onClick={handleDownloadReportCSV}>
										as CSV
									</button>
								</li>
								<li>
									<button
										disabled={fileDownloading}
										className="btn btn-light btn-sm text-start w-100 mb-2 text-nowrap"
										onClick={handleDownloadReportJson}>
										as JSON
									</button>
								</li>
							</ul>
						</div>

						<select
							style={{ maxWidth: "12rem" }}
							value={dataFrom}
							onChange={(e) => setDataFrom(e.target.value)}
							class="form-select form-control-sm form-select-sm"
							aria-label="Default select example">
							{dataFromOptions.map((opt) => (
								<option key={opt.key} value={opt.key}>
									Data From: {opt.value}
								</option>
							))}
						</select>
					</section>

					<section>
						<p className="mb-2 p-1 h3">Sales Report: {dataFromDisplay}</p>
						<div className="table-responsive">
							<table
								ref={reportTable}
								id="sales-report"
								class="table  text-nowrap">
								<thead>
									<tr>
										<th scope="col">Order Date</th>
										<th scope="col">Order ID</th>
										<th scope="col">Customer Name</th>
										<th scope="col">Product Name</th>
										<th scope="col">Product ID</th>
										<th scope="col">Quantity</th>
										<th scope="col">Unit Price</th>
										<th scope="col">Total Price</th>
									</tr>
								</thead>
								<tbody>
									{salesReportData.map((sale) => (
										<tr>
											<td>{convertISOToDate(sale?.createdAt, true)}</td>
											<td>{sale?.orderId}</td>
											<td>{sale?.user?.fullName}</td>
											<td>{sale?.orderItems[0]?.product.name}</td>
											<td>{sale?.orderItems[0]?.product._id}</td>
											<td>{sale?.orderItems[0]?.quantity}</td>
											<td>
												{sale?.totalPrice / sale?.orderItems[0]?.quantity}
											</td>
											<td>{sale?.totalPrice}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					{/* ADDING THIS FULL SCREEN SO PDF CAN BE DOWNLOADED */}
					<div
						className={
							pdfDownloading ? "position-fixed top-0 opacity-0" : "d-none"
						}
						style={{ zIndex: -100 }}>
						<section ref={reportHTML}>
							<p className="mb-2 p-1 h3">Sales Report: {dataFromDisplay}</p>
							<div>
								<table
									ref={reportTable}
									id="sales-report"
									class="table text-responsive text-nowrap">
									<thead>
										<tr>
											<th scope="col">Order Date</th>
											<th scope="col">Order ID</th>
											<th scope="col">Customer Name</th>
											<th scope="col">Product Name</th>
											<th scope="col">Product ID</th>
											<th scope="col">Quantity</th>
											<th scope="col">Unit Price</th>
											<th scope="col">Total Price</th>
										</tr>
									</thead>
									<tbody>
										{salesReportData.map((sale) => (
											<tr>
												<td>{convertISOToDate(sale?.createdAt, true)}</td>
												<td>{sale?.orderId}</td>
												<td>{sale?.user?.fullName}</td>
												<td>{sale?.orderItems[0]?.product.name}</td>
												<td>{sale?.orderItems[0]?.product._id}</td>
												<td>{sale?.orderItems[0]?.quantity}</td>
												<td>
													{sale?.totalPrice / sale?.orderItems[0]?.quantity}
												</td>
												<td>{sale?.totalPrice}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>
					</div>
				</>
			)}
		</div>
	);
};

export default SalesReport;
