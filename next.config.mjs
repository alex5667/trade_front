/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	basePath: '/menu-front',
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
