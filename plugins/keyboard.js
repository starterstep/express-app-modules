var lastFocusedField = null;

module.exports = function(context) {
    var view = context.view;

    var handleClick = function(e) {
        //console.log('!!!!!View on touchstart lastFocusedField=', lastFocusedField);
        if (lastFocusedField && lastFocusedField !== e.source) {
            lastFocusedField.blur();
            lastFocusedField = null;
        }
    };

    view.addEventListener('keyboard-blur', function(e) {
        if (e.plugin && e.plugin.reset) {
            e.plugin.reset();
        }
        handleClick(e);
    });

    view.addEventListener('touchstart', handleClick);

    view.find(function(view) {
        if (view.apiName == 'Ti.UI.TextField' || view.apiName == 'Ti.UI.TextArea') {
            //console.log('!!!!!Keyboard TextField or TextArea')
            view.addEventListener('focus', function() {
                //console.log('!!!!!TextField on focus lastFocusedField will =', view);
                lastFocusedField = view;
            });
        }
    });

};