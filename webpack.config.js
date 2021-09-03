const path = require('path')

module.exports = {
    entry: './static/js/notation.js',
    output: {
        filename: 'notation_bundle.js',
        path: path.resolve('./static/js/'),
    }
}