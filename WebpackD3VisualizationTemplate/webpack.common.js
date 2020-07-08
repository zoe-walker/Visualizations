const CopyPlugin = require('copy-webpack-plugin');
const VersionFile = require('webpack-version-file-plugin'); // Used to write package version number into visualization config
const path = require('path');
const outputPath = path.join(__dirname, 'dist');
const fs = require('fs');
//require("core-js");
//require("regenerator-runtime/runtime");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry',
                                    //
                                    // TODO: Amend CoreJS version and supported browsers if necessary
                                    //
                                    corejs: '3.1.4',
                                    targets: {
                                        chrome: 34,
                                        ie: 11,
                                        edge: 20,
                                        firefox: 30,
                                    },
                                    modules: false
                                }
                            ]
                        ],
                        plugins: [
                        ],
                    }
                }
            },
        ]
    },
    entry: fs.readdirSync(path.join(__dirname, 'src'))
        .filter(d => fs.lstatSync(path.join(__dirname, 'src', d)).isDirectory())
        .filter(d => fs.readdirSync(path.join(__dirname, 'src', d)).find(d => d === 'visualization.config.json'))
        .reduce(function (prev, current) {
            prev[current] = path.join(
                __dirname,
                'src',
                current,
                require('./src/' + current + '/visualization.config.json').entry.file
            );
            return prev;
        }, {}),
    output: {
        filename: '[name]/visualization.js',
        path: outputPath,
        //libraryTarget: "var",
        library: 'vis'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                "d3" : {
                    test: /[\\/]node_modules[\\/](d3.*)[\\/]/,
                    name: 'd3',
                    chunks: 'all',
                    priority: -3,
                    enforce: true
                },
                "other" : {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'other',
                    chunks: 'all',
                    priority: -10,
                    enforce: true
                }
            }
        }
    },
    plugins: getPlugins()
};

function getPlugins() {
    class VisualizationDirectory
    {
        constructor(dirName) {
            this.directoryName = dirName;
        }
        imageFiles() {
            return fs.readdirSync(
                        path.join(__dirname,
                        'src',
                        this.directoryName))
                    .filter(f => path.extname(f) == '.png');
                }
        configFiles() {
            return [
                'visualization.config.json',
                'visualization.datashape.gql'
            ]
        }
    }

    let VisualizationDirectories = fs.readdirSync(path.join(__dirname, 'src'))
        .filter(d => fs.lstatSync(path.join(__dirname, 'src', d)).isDirectory())
        .map(d => new VisualizationDirectory(d));
//
// VersionFile for visualization package configuration
//
    let vpcVersionFile = Object(new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        template: path.join(__dirname, 'src/package.json.ejs'),
        outputFile: path.join(__dirname, 'src/package.json')
    }));
//
//  VersionFiles for each visualization configuration
//
    let vcVersionFiles = VisualizationDirectories
        .map(d => Object(new VersionFile({
            packageFile: path.join(__dirname, 'package.json'),
            template: path.join(__dirname, 'src', d.directoryName, 'visualization.config.json.ejs'),
            outputFile: path.join(__dirname, 'src', d.directoryName, 'visualization.config.json')
            })));
//
// CopyPlugin for visualization package configuration
//
    let vpcCopyPlugin = Object(new CopyPlugin(
        [getCopyPluginOption('', 'package.json')]
    ));
//
// CopyPlugin for each visualization configuration
//
    let vcCopyPlugins = VisualizationDirectories
    .map(d => Object(new CopyPlugin(
        d.configFiles().map(f => getCopyPluginOption(d.directoryName, f))))
    );
//
// CopyPlugin for each visualization image file
//
    let viCopyPlugins = VisualizationDirectories
        .map(d => Object(new CopyPlugin(
            d.imageFiles().map(f => getCopyPluginOption(d.directoryName, f))))
        );

    return [vpcVersionFile, vpcCopyPlugin]
        .concat(vcVersionFiles)
        .concat(vcCopyPlugins)
        .concat(viCopyPlugins);
}

/**
 * 
 * @param {string} directoryName - name of sub-directory containing file or empty
 * @param {string} fileName - name of file
 */
function getCopyPluginOption(directoryName, fileName)
{
    return {
        context: __dirname,
        from: path.join('src', directoryName, fileName),
        to: path.join(directoryName, fileName)
    };
}
