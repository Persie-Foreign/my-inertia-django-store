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
        zIndex: {
            0: '0',
            10: '10',
            20: '20',
            30: '30',
            40: '40',
            50: '50',
            100: '100', // 👈 Add this
        },
    },

    plugins: [
        // add any Tailwind plugins you like, e.g. forms, typography
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
