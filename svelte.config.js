import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // SPA fallback for client-side routing
			precompress: false,
			strict: true
		}),
		paths: {
			// Set base path for GitHub Pages (repo name)
			// Leave empty for custom domain or username.github.io
			base: process.env.NODE_ENV === 'production' ? '' : ''
		}
	}
};

export default config;
