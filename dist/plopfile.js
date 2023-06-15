"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
const generateCommand = require('./plop-templates/command');
module.exports = function (plop) {
    plop.setGenerator('Command', generateCommand);
};
