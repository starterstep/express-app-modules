var EventEmitter = require('events');

module.exports = function(context) {
    var view = context.view;
    var isEnabled = true;

    var $ = new EventEmitter();

    var on = view.first(function(view) {
        return view.plugin && view.plugin.indexOf('switch-on') != -1;
    })[0];

    var off = view.first(function(view) {
        return view.plugin && view.plugin.indexOf('switch-off') != -1;
    })[0];

    var fireEvent = function() {
        view.fireEvent('switch-toggle', {
            value: $.value(),
            bubbles: true
        });
        $.emit('switch-toggle', {
            value: $.value()
        });
    };

    $.toggleOn = function(fire) {
        //console.log('### on ###', $.value());
        on.setVisible(true);
        off.setVisible(false);
        //console.log('### after on ###', $.value());

        if (fire) {
            fireEvent();
        }
    };

    $.toggleOff = function(fire) {
        //console.log('### off ###', $.value());
        off.setVisible(true);
        on.setVisible(false) ;
        //console.log('### after off ###', $.value());

        if (fire) {
            fireEvent();
        }
    };

    $.toggle = function(fire) {
        //console.log('### toggle ###');
        $.value()?$.toggleOff():$.toggleOn();

        if (fire) {
            fireEvent();
        }
    };

    $.value = function() {
        return on.getVisible();
    };

    $.setEnabled = function(enabled) {
        isEnabled = enabled;
        view.opacity = isEnabled ? 1.0 : 0.5;
    };

    view.addEventListener('click', function(e) {
        if(isEnabled) {
            e.cancelBubble = true;
            $.toggle(true);
        }
    });

    $.toggleOff();

    return $;
};