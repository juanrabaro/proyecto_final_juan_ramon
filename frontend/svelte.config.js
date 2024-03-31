import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';
import sass from 'sass';

const production = !process.env.ROLLUP_WATCH;

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter()
    },
    preprocess: sveltePreprocess({
        sourceMap: !production,
        sass: {
            renderSync: true,
            implementation: sass,
        },
    }),
};

export default config;