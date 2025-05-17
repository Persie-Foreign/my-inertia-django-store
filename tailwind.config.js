/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. Tell Tailwind where your template files live:
    content: [
        './static/src/js/**/*.jsx',
        './static/src/js/**/*.js',
        './static/src/css/**/*.css',
        './templates/**/*.html',      // if you have any Django templates
    ],

    theme: {
        extend: {
            // any custom colors, spacing, etc. go here
        },
    },

    plugins: [
        // add any Tailwind plugins you like, e.g. forms, typography
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
