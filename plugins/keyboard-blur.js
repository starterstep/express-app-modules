module.exports = function(context) {
    var view = context.view;

    var $ = {};

    var fireBlur = function() {
        view.fireEvent('keyboard-blur', {
            bubbles: true,
            source: view,
            plugin: $
        });
    };

    if (view.apiName == 'Ti.UI.TableView') {
        var handleScroll = function() {
            view.removeEventListener('scroll', handleScroll);
            scrollListenerAdded = false;
            fireBlur();
        };

        view.addEventListener('scroll', handleScroll);
        var scrollListenerAdded = true;
    }

    view.addEventListener('touchstart', fireBlur);

    $.reset = function() {
        if (view.apiName == 'Ti.UI.TableView' && !scrollListenerAdded) {
            view.addEventListener('scroll', handleScroll);
            scrollListenerAdded = true;
        }
    };

    return $;
};