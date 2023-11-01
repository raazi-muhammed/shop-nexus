import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const BarChart = ({ chartData }) => {
	return (
		<div className="w-100 h-100">
			<Bar data={chartData} />
		</div>
	);
};

export default BarChart;
