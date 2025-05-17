const { resolve } = require('path');

module.exports = {
    plugins: [



    ],
    root: resolve('./static/src'),
    base: '/static/',
    publicDir: resolve(__dirname, 'public'),

    server: {
        host: 'localhost',
        port: 5173,
        open: false,
        watch: {
            usePolling: true,
            disableGlobbing: false,
        },
    },
    resolve: {
        extensions: ['.js', '.json'],
    },


    build: {
        outDir: resolve('./static/dist'),
        assetsDir: '',
        manifest: true,
        emptyOutDir: true,
        target: 'es2015',
        rollupOptions: {
            input: {
                main: resolve('./static/src/js/main.jsx'),
            },
            output: {
                chunkFileNames: undefined,
            },
        },
    },
};