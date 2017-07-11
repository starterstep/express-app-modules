var _ = require('underscore');

module.exports = function(context) {
    var button = context.view;
    var controller = context.controller;

    var $ = {};

    var eventName = null;
    var options = null;
    var titles = null;

    button.addEventListener('click', function() {
        var dialog = Ti.UI.createOptionDialog({
            options: titles,
            cancel: options.length-1
        });
        dialog.addEventListener('click', function(e) {
            if (e.index !== options.length-1) {
                button.title = options[e.index].display;
                controller.trigger(eventName, options[e.index].value, e.index);
            }
        });
        dialog.show();
    });

    $.load = function(params) {
        eventName = params.eventName || 'selected';
        options = params.options;
        options.push({
            display:'Cancel',
            value:'cancel'
        });
        titles = _.pluck(options, 'display');
    };

    return $;
};