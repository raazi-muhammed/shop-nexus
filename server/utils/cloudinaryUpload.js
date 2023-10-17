const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const opts = {
	overwrite: true,
	invalidate: true,
	resource_type: "auto",
	transformation: [
		{ width: 700, height: 700, crop: "fill" }, // Adjust the width, height, and crop mode as needed
	],
	folder: "shop-nexus",
};

module.exports = (image) => {
	return new Promise((res, rej) => {
		cloudinary.uploader.upload(image, opts, (err, result) => {
			if (result && result.secure_url) {
				return res(result.secure_url);
			}
			console.log(err.message);
			return;
		});
	});
};
