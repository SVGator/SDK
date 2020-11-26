let path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');

let pkg = require('./svgator-frontend/package.json');
let version = pkg.version.replace(/[^0-9a-z]+/g, '-');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './svgator-frontend/browser.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'svgator-frontend.latest.js'
    },
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: './dist/svgator-frontend.latest.js',
                            destination: './dist/svgator-frontend.' + version + '.js',
                        }
                    ],
                },
            },
        }),
    ],
};
