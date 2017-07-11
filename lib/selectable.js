var _ = require('underscore');
var EventEmitter = require('events');

module.exports = function(views) {
    var $ = new EventEmitter();

    var lastSelectedView = null;
    var lastSelectedIndex = -1;
    var unselectedView = null;
    var unselectedIndex = -1;
    var firstTimeSelections = [];

    _.each(views, function(view, index) {
        firstTimeSelections.push(true);
        view.addEventListener('click', function() {
            $.select(index);
        });
    });

    $.select = function(index, ceaseFire) {
        var view = views[index];
        var firstTime = firstTimeSelections[index];

        var data = {
            index: index,
            view: view
        };
        if (firstTime) {
            data.firstTime = firstTime;
            firstTimeSelections[index] = false;
        }
        //console.log('OMGE count = ', $.listenerCount('selected'))
        if (index === lastSelectedIndex) {
            $.emit('reselected', data);
            return;
        }

        if (!ceaseFire) {
            $.emit('selected', data);
        }

        if (lastSelectedView) {
            unselectedIndex = lastSelectedIndex;
            unselectedView = lastSelectedView;
            if (!ceaseFire) {
                $.emit('unselected', {
                    index: unselectedIndex,
                    view: unselectedView
                });
            }
        }
        lastSelectedView = view;
        lastSelectedIndex = index;
    };

    $.selected = function() {
        return lastSelectedView ? {
            index: lastSelectedIndex,
            view: lastSelectedView
        } : null;
    };

    $.unselected = function() {
        return unselectedView ? {
            index: unselectedIndex,
            view: unselectedView
        } : null;
    };

    $.reset = function() {
        if (lastSelectedView) {
            $.emit('unselected', {
                index: lastSelectedIndex,
                view: lastSelectedView
            });
        }

        firstTimeSelections = [];
        lastSelectedView = null;
        lastSelectedIndex = -1;
        unselectedView = null;
        unselectedIndex = -1;
        _.each(views, function() {
            firstTimeSelections.push(true);
        });
    };

    return $;
};