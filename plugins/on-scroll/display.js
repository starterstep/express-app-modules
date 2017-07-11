module.exports = function(context) {
    var view = context.view;
    var originalHeight = view.height;

    var $ = {};

    $.hide = function() {
        view.height = 0;
    };

    $.show = function() {
        view.height = originalHeight;
    };

    $.load = function(onScroll) {
        onScroll.on('top-away', function() {
            // console.log('!!!TOP-AWAY');
            $.hide();
        });
        onScroll.on('top', function() {
            // console.log('!!!TOP');
            $.show();
        });
    };

    return $;
};