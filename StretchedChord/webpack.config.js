const ZipFilesPlugin = require('webpack-zip-files-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

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
        'vis': path.join(__dirname, 'src/cord_diagram.js'),
    },
    output: {
        filename: 'vis/cord_diagram.js',
        libraryTarget: 'var',
        library: 'vis'
    },
    plugins: [
        new CopyPlugin([
            { context: __dirname, from: 'src/package.json', to: 'package.json' },
            { context: __dirname, from: 'src/visualization.config.json', to: 'vis/visualization.config.json' },
            { context: __dirname, from: 'src/visualization.datashape.gql', to: 'vis/visualization.datashape.gql' },
        ]),
        new ZipFilesPlugin({
            output: path.join(__dirname, 'visualizations'),
            entries: require('fs').readdirSync(path.join(__dirname, 'dist')).map(function (d) { return { src: path.join(__dirname, './dist/' + d), dist: d } })
        })
    ],
    optimization: {
        minimize: false
    },
};