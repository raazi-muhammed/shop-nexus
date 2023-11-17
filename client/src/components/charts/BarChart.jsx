import React, { useState } from "react";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const BarChart = ({ chartData }) => {
	const [currentChart, setCurrentChart] = useState("BAR");
	const handleChartChange = (type) => {
		setCurrentChart(type);
	};
	return (
		<section>
			<hr className="text-light" />
			<div className="d-flex justify-content-center my-3 gap-2">
				<button
					onClick={() => handleChartChange("BAR")}
					className={`${
						currentChart === "BAR"
							? "btn-secondary text-white"
							: "btn-outline-light text-secondary"
					} btn btn-sm px-3`}>
					Bar
				</button>
				<button
					onClick={() => handleChartChange("LINE")}
					className={`${
						currentChart === "LINE"
							? "btn-secondary text-white"
							: "btn-outline-light text-secondary"
					} btn btn-sm px-3`}>
					Line
				</button>
				<button
					onClick={() => handleChartChange("PIE")}
					className={`${
						currentChart === "PIE"
							? "btn-secondary text-white"
							: "btn-outline-light text-secondary"
					} btn btn-sm px-3`}>
					Pie
				</button>
				<button
					onClick={() => handleChartChange("RADAR")}
					className={`${
						currentChart === "RADAR"
							? "btn-secondary text-white"
							: "btn-outline-light text-secondary"
					} btn btn-sm px-3`}>
					Radar
				</button>
			</div>
			<div
				style={{ maxHeight: "min(70vh, 35rem)" }}
				className="w-100 h-100 d-flex justify-content-center">
				{currentChart == "BAR" ? (
					<Bar
						data={chartData}
						options={{
							fill: true,
							backgroundColor: "#7a76e2",
							hoverBackgroundColor: "#342475",
							borderRadius: 10,
						}}
					/>
				) : currentChart == "LINE" ? (
					<Line
						data={chartData}
						options={{
							fill: true,
							backgroundColor: "#d7d6f6",
							borderColor: "#7a76e2",
							hoverBackgroundColor: "#342475",
							borderRadius: 10,
						}}
					/>
				) : currentChart == "RADAR" ? (
					<Radar
						data={chartData}
						options={{
							fill: true,
							backgroundColor: "#d7d6f6",
							borderColor: "#7a76e2",
							hoverBackgroundColor: "#342475",
							borderRadius: 10,
						}}
					/>
				) : (
					<Pie
						data={chartData}
						options={{
							fill: true,
							backgroundColor: [
								"#6c68d9",
								"#5f5bd0",
								"#938fe7",
								"#847edb",
								"#716ccf",
								"#9a96eb",
								"#807ade",
							],
							borderRadius: 0,
							borderColor: "#fff",
							hoverBackgroundColor: "#342475",
						}}
					/>
				)}
			</div>
		</section>
	);
};

export default BarChart;
