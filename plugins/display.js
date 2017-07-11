var ea = require('express-app');

module.exports = function(context) {
    var view = context.view;

    var $ = ea.lib.displayable(view);

    view.addEventListener('display-hide', function(e) {
        $.hide();
        e.cancelBubble = true;
    });

    return $;
};