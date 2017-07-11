var ea = require('express-app');

var _ = require('underscore');

module.exports = function(context) {
    var selectView = context.view;
    var selectable = ea.lib.selectable;

    var options = selectView.find(function(view) {
        return view.plugin && view.plugin.indexOf('select-option') != -1;
    });

    var $ = selectable(options);

    return _.extend($, ea.lib.displayable(selectView));
};