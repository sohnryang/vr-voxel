module.exports = {
    entry: {
        'entry': './js/app.js'
    },
    output: {
        filename: 'build/bundle.js'
    },
    debug: true,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [[
                        'env', {
                            targets: {
                                browsers: ['last 2 versions']
                            }
                        }
                    ]]
                }
            }
        ]
    }
}