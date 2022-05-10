import adapter from 'svelte-adapter-github';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],

    kit: {
        paths: { base: '/Crypto' },
        adapter: adapter({ precompress: true }),
    },
};

export default config;
