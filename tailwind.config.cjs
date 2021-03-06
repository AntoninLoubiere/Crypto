const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(195, 71%, 50%)',
                    200: 'hsl(195, 50%, 90%)',
                    800: 'hsl(195, 90%, 30%)',
                },
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
