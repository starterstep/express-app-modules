var ea = require('express-app');

module.exports = function(context) {
    ea.lib.query(context.view);
};