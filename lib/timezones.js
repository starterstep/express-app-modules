var _ = require('underscore');
var moment = require('moment');
require('moment-timezone');

module.exports = function() {
    return _.map(moment.tz.names(), function(name) {
        return {
            value: name,
            display: '(GMT ' + moment.tz(name).format('Z') + ') ' + name
        }
    }).reverse();
};