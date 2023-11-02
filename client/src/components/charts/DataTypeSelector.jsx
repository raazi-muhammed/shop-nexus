import React from "react";

const DataTypeSelector = ({ dataType, setDataType, dataTypeOptions }) => {
	return (
		<select
			style={{ maxWidth: "15rem" }}
			value={dataType}
			onChange={(e) => setDataType(e.target.value)}
			class="form-select form-control-sm form-select-sm"
			aria-label="Default select example">
			{dataTypeOptions.map((opt) => (
				<option key={opt.key} value={opt.key}>
					Show: {opt.value}
				</option>
			))}
		</select>
	);
};

export default DataTypeSelector;
