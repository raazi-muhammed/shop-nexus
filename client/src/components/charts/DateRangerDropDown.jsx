import React, { useState } from "react";

const DateRangerDropDown = ({
	setRefresh,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const today = new Date();
	const [showCustomDateSelector, setShowCustomDateSelector] = useState(false);
	const handleLastNDaysClick = (days) => {
		setStartDate(new Date(new Date().setDate(new Date().getDate() - days)));
		setEndDate(today);
	};

	return (
		<div class="dropdown">
			<button
				type="button"
				class="btn btn-sm btn-light text-primary dropdown-toggle px-3"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				data-bs-auto-close="outside">
				Date Range
			</button>
			<form
				style={{ width: "20rem" }}
				onSubmit={(e) => {
					e.preventDefault();
					setRefresh((refresh) => !refresh);
				}}
				class="dropdown-menu p-4">
				<button
					onClick={() => handleLastNDaysClick(1)}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					Today
				</button>
				<button
					onClick={() => handleLastNDaysClick(7)}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					Last 7 Days
				</button>
				<button
					onClick={() => handleLastNDaysClick(30)}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					Last 30 Days
				</button>
				<button
					onClick={() => handleLastNDaysClick(365)}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					Last 365 Days
				</button>
				<button
					onClick={() => {
						setStartDate(null);
						setEndDate(null);
					}}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					All Time
				</button>
				<button
					type="button"
					onClick={() => setShowCustomDateSelector(!showCustomDateSelector)}
					className="btn btn-sm btn-light text-start w-100 mb-2">
					Custom
				</button>
				{showCustomDateSelector ? (
					<>
						<div class="mb-3">
							<label for="exampleInputPassword1" class="form-label text-small">
								Start Date
							</label>
							<input
								value={startDate?.toISOString().slice(0, 10)}
								onChange={(e) =>
									setStartDate(e.target.value ? new Date(e.target.value) : null)
								}
								class="form-control form-control-sm rounded-pill"
								type="date"
							/>
						</div>

						<div class="mb-3">
							<label for="exampleInputPassword1" class="form-label text-small">
								End Date
							</label>
							<input
								value={endDate?.toISOString().slice(0, 10)}
								onChange={(e) =>
									setEndDate(e.target.value ? new Date(e.target.value) : null)
								}
								class="form-control form-control-sm rounded-pill"
								type="date"
							/>
						</div>
						<button className="btn btn-sm w-100 text-white btn-secondary">
							Apply
						</button>
					</>
				) : null}
			</form>
		</div>
	);
};

export default DateRangerDropDown;
