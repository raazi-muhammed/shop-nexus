const findWithPaginationAndSorting = async (
	req,
	Database,
	findQuery,
	populateString = ""
) => {
	const ITEMS_PER_PAGE = 10;
	const { page, sort } = req.query;
	const skip = (page - 1) * ITEMS_PER_PAGE;

	const countPromise = Database.countDocuments(findQuery);

	const dataBaseDataPromise = await Database.find(findQuery)
		.populate(populateString)
		.limit(ITEMS_PER_PAGE)
		.skip(skip)
		.sort({ [sort]: -1 });

	const [count, dataBaseData] = await Promise.all([
		countPromise,
		dataBaseDataPromise,
	]);

	const pagination = {
		count,
		page,
		pageCount: Math.ceil(count / ITEMS_PER_PAGE),
		startIndex: ITEMS_PER_PAGE * page - ITEMS_PER_PAGE,
	};

	return [pagination, dataBaseData];
};

module.exports = findWithPaginationAndSorting;
