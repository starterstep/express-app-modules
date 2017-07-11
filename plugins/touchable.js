module.exports = function(context) {
    var view = context.view;

    var original = view.opacity;

    view.addEventListener('touchstart', function(e) {
        view.opacity = .5;
    });

    view.addEventListener('touchend', function(e) {
        view.opacity = original;
    });

    view.addEventListener('touchcancel', function(e) {
        view.opacity = original;
    });

    return view;
};