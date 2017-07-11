var ea = require('express-app');

var _ = require('underscore');

module.exports = function(context) {
    var tabsView = context.view;
    var selectable = ea.lib.selectable;

    var lastSelectedContent = null;
    var unselectedBackgroundColor = null;

    var tabs = tabsView.find(function(view) {
        return view.plugin && view.plugin.indexOf('tabs-title') != -1;
    });

    var contents = tabsView.find(function(view) {
        return view.plugin && view.plugin.indexOf('tabs-panel') != -1;
    });

    if(contents.length) {
        _.each(contents, function(content) {
            content.opacity = 0;
            content.zIndex = 0;
        });
    }

    var $ = selectable(tabs);

    $.on('selected', function(e) {
        unselectedBackgroundColor = e.view.backgroundColor || 'transparent'; //fix for Android

        e.view.backgroundColor = e.view.backgroundSelectedColor || e.view.selectedBackgroundColor || unselectedBackgroundColor;

        e.view.find(function(view) {
            if(view.selectedColor) {
                view.unselectedColor = view.color;
                view.color = view.selectedColor;
            }
        });

        var content = contents[ e.index ];
        if(lastSelectedContent) {
            lastSelectedContent.opacity = 0;
            lastSelectedContent.zIndex = 0;
        }
        if(content) {
            content.opacity = 1;
            content.zIndex = 1;
        }
        lastSelectedContent = content;
    });

    $.on('unselected', function(e) {
        e.view.backgroundColor = unselectedBackgroundColor;
        e.view.find(function(view) {
            if(view.unselectedColor) {
                view.color = view.unselectedColor;
            }
        });
    });

    return _.extend($, ea.lib.displayable(tabsView));
};