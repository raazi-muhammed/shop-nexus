const aggregateWithPaginationAndSorting = async (req, Database, findQuery) => {
	const ITEMS_PER_PAGE = 10;
	const { page, sort } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;

	const count = await Database.aggregate(findQuery);

	findQuery.push({ $sort: { [`items.${sort}`]: -1 } });
	findQuery.push({ $skip: skip });
	findQuery.push({ $limit: ITEMS_PER_PAGE });

	const dataBaseData = await Database.aggregate(findQuery);

	const pagination = {
		count: count.length,
		page,
		pageCount: Math.ceil(count.length / ITEMS_PER_PAGE),
		startIndex: ITEMS_PER_PAGE * page - ITEMS_PER_PAGE,
	};

	return [pagination, dataBaseData];
};

module.exports = aggregateWithPaginationAndSorting;
