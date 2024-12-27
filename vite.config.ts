import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [mkcert(), sveltekit()],

	optimizeDeps: {
		exclude: ['wasm-vips']
	},

	build: {
		target: 'esnext'
	},

	server: {
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},

	worker: {
		format: 'es'
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})
