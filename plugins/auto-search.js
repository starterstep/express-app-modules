var Emitter = require('events');

module.exports = function(context) {
    var $ = new Emitter();

    var input = context.view;
    var controller = context.controller;

    var triggerSearch = null;
    var clear = false;
    var blurOnSearch = !/no-blur/.test(input.plugin);

    input.addEventListener('change', function() {
        if (clear) {
            clear = false;
            return;
        }

        if (triggerSearch) {
            clearTimeout(triggerSearch);
        }
        var term = input.value.trim();
        if (term.length === 0 || term.length > 2) {
            triggerSearch = setTimeout(function() {
                controller.trigger('search', term);
                $.emit('search', term);
                if (blurOnSearch) {
                    input.blur();
                }
            }, 1000);
        }
    });

    $.clear = function() {
        clear = !Alloy.OS_IOS;
        input.value = '';
    };

    return $;
};