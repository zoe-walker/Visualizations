const ZipFilesPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require('path');

//process.traceDeprecation = true;

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: {
                                        chrome: '34',
                                        ie: '11',
                                        edge: '20',
                                        firefox: '30',
                                    },
                                    modules: false
                                }
                            ],
                        ]
                    }
                }
            },
        ]
    },
    entry: {
        'vis': path.join(__dirname, 'src/stretched_chord.js'),
    },
    output: {
        filename: 'vis/stretched_chord.js',
        libraryTarget: 'var',
        library: 'vis'
    },
    plugins: [
        new CopyPlugin([
            { context: __dirname, from: 'src/package.json', to: 'package.json' },
            { context: __dirname, from: 'src/visualization.config.json', to: 'vis/visualization.config.json' },
            { context: __dirname, from: 'src/visualization.datashape.gql', to: 'vis/visualization.datashape.gql' },
        ]),
        new CleanWebpackPlugin(),
        new ZipFilesPlugin({
            path: '..',
            filename: 'visualizations'
        })
          ],
    optimization: {
        minimize: false
    },
};