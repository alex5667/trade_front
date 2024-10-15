/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	// experimental: {
	//   turbo: {
	//     rules: {
	//       "*.scss": {
	//         loaders: ["sass-loader"],
	//         as: "*.css",
	//       },
	//     },
	//   }

	// }
	sassOptions: {
		silenceDeprecations: ['legacy-js-api']
	}
}

export default nextConfig
