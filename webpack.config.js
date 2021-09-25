const path = require('path')

module.exports = {
    entry: {
        notation: {import: './static/js/notation.js', dependOn: 'shared'},
        learn_notation: {import: './static/js/learn_notation.js', dependOn: 'shared'},
        shared: 'vexflow',
    },
    output: {
        filename: '[name]_bundle.js',
        path: path.resolve('./static/js/'),
    }
}
