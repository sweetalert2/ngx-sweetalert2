const path = require('path');
const webpack = require('webpack');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

function root(relunixpath) {
    let fullpath = [__dirname].concat(relunixpath.split('/'));
    return path.join(...fullpath);
}

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js']
    },

    entry: root('index.ts'),

    output: {
        path: root('dist'),
        publicPath: '/',
        filename: 'ng-sweetalert2.umd.js',
        libraryTarget: 'umd',
        library: 'ng-sweetalert2'
    },

    externals: [/^\@angular\//, /^rxjs\//],

    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            root('src')
        )
    ],

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [root('node_modules')]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader?declaration=false',
            exclude: [/\.e2e\.ts$/]
        }]
    }
};
