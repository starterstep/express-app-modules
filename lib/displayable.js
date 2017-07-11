module.exports = function(view) {

    var $ = {};

    $.show = function() {
        setTimeout(function() {
            view.visible = true;
        }, 0);
    };

    $.hide = function() {
        setTimeout(function() {
            view.visible = false;
        }, 0);
    };

    return $;
};