import React from "react";
import Icons from "../assets/Icons";
const { refresh: refreshIcon } = Icons;

const RefreshButton = ({ refresh, setRefresh }) => {
	return (
		<button
			onClick={() => setRefresh(!refresh)}
			className="btn btn-light text-primary btn-sm m-0">
			{refreshIcon}
		</button>
	);
};

export default RefreshButton;
