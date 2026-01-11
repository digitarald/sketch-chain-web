import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', // GitHub Pages uses 404.html for SPA fallback
			precompress: false,
			strict: true
		}),
		paths: {
			// Set base path for GitHub Pages (repo name)
			// Uses BASE_PATH env var set in CI, empty for local dev
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;
