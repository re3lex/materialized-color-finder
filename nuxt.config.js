
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

export default {
	mode: 'spa',

	router: {
		base: process.env.NODE_ENV === 'dev' ? '/' : '/color-palette/',
	},

	/* * Headers of the page */
	head: {
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css' },
		],
	},

	/* * Customize the progress-bar color */
	loading: { color: '#3B8070' },

	/* * Global CSS */
	css: [
	],

	/* * Plugins to load before mounting the App */
	plugins: [
		'~/plugins/v-clipboard',
	],

	/* * Nuxt.js modules */
	modules: [
		'bootstrap-vue/nuxt',
		'@nuxtjs/style-resources',
		'@nuxtjs/dotenv',
	],

	styleResources: {
		scss: [
			'assets/scss/_color-variables.scss',
			'assets/scss/_color-classes.scss',
		],
	},

	/* * Build configuration */
	build: {
		extractCSS: true,

		/* * You can extend webpack config here */
		extend(config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
				});
			}

			if (isDev) {
				config.devtool = isClient ? '#eval-source-map' : '#inline-source-map';
			}
		},
	},
};
