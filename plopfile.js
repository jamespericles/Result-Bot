/* eslint-disable @typescript-eslint/no-var-requires */
const generateCommand = require('./plop/Command/index.js')

module.exports = function (plop) {
  plop.setGenerator('Command', generateCommand)
}
