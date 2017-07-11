var ea = require('express-app');

var _ = require('underscore');

module.exports = function(context) {
    var tableView = context.view;
    var controller = context.controller;

    var $ = ea.plugins.onScroll(context);

    var displayOnScroll = null;

    var hasSections = false;

    var rowsOrSections = [];

    controller.load = function(items) {
        hasSections = !!controller.loadSection;

        rowsOrSections = [];

        tableView.setData(rowsOrSections);

        if(displayOnScroll) {
            displayOnScroll.show();
        }

        $.reset();
        $.on('bottom', function() {
            $.disable();
            console.log('!!!BOTTOM');
            controller.trigger('more');
        });

        if(displayOnScroll) {
            displayOnScroll.load($);
        }

        _.each(items, function(item) {
            rowsOrSections.push(hasSections ? controller.loadSection(item) : controller.loadRow(item));
        });

        tableView.setData(rowsOrSections);
    };

    controller.loadMore = function(moreItems) {
        rowsOrSections = [];

        _.each(moreItems, function(item) {
            rowsOrSections.push(hasSections ? controller.loadSection(item) : controller.loadRow(item));
        });

        if(hasSections){
            tableView.appendSection(rowsOrSections);
        } else {
            tableView.appendRow(rowsOrSections);
        }

        setTimeout(function() {
            $.enable();
        }, 0);
    };

    $.load = function(_displayOnScroll) {
        displayOnScroll = _displayOnScroll;
    };

    return $;
};