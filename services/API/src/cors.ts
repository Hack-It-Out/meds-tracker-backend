export const cors = {
	origins: {
		local: [
			"*",
			/\.localhost:4200$/,
			/\.192.168.1.156:4200$/,
			"http://localhost:4200",
			"http://192.168.1.156:4200",
		],
		prod: [],
	},
	allowedHeaders: {
		local: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Origin",
		],
		prod: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Origin",
		],
	},
	// exposedHeaders: {
	// 	local: [
	// 		"Content-Type",
	// 		"Authorization",
	// 		"Access-Control-Allow-Headers",
	// 		"Access-Control-Allow-Origin",
	// 	],
	// 	prod: [
	// 		"Content-Type",
	// 		"Authorization",
	// 		"Access-Control-Allow-Headers",
	// 		"Access-Control-Allow-Origin",
	// 	],
	// },
	methods: {
		local: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
		prod: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
	},
	credentials: { local: true, prod: true },
};
