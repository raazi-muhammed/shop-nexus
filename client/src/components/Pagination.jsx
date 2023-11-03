import React from "react";

const Pagination = ({ pagination, setPagination }) => {
	const handlePreviousClick = () => {
		if (pagination.page <= 1) return;
		setPagination({
			...pagination,
			page: Number(pagination.page) - 1,
		});
	};

	const handleNextClick = () => {
		if (pagination.page >= pagination.pageCount) return;
		setPagination({
			...pagination,
			page: Number(pagination.page) + 1,
		});
	};

	const handleSinglePageClick = (newPage) => {
		setPagination({
			...pagination,
			page: Number(newPage),
		});
	};

	return (
		<nav aria-label="Page navigation ms-auto ">
			<ul class="pagination justify-content-end pagination-sm ">
				<li class="page-item">
					<a
						onClick={handlePreviousClick}
						class={`page-link`}
						aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				{[...Array(pagination.pageCount)].map((e, i) => (
					<li key={i} class="page-item ">
						<a
							onClick={(e) => handleSinglePageClick(i + 1)}
							class={`page-link ${
								pagination.page === i + 1 ? "bg-light" : null
							}`}>
							{i + 1}
						</a>
					</li>
				))}
				<li class="page-item">
					<a onClick={handleNextClick} class="page-link" aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
