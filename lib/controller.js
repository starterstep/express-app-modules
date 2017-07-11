var ea = require('express-app');
var _ = require('underscore');
var s = require('underscore.string');

var aliasCreateController = Alloy.createController;

Alloy.createController = function(path, args) {
    //console.log('new Alloy.createController', path, args);
    var splits = path.split('/');

    var controller = null;
    if (splits.length > 1) {
        controller = ea.controllers;
        _.each(splits, function(split) {
            if (controller) {
                controller = controller[s.camelize(split)];
            }
        });
    } else {
        controller = ea.controllers[s.camelize(path)];
    }
    if (controller) {
        //console.log('!!!!Creating express-app Controller with args');
        return controller(args);
    }
    //console.log('!!!!Creating Alloy Controller');
    return aliasCreateController(path, args);
};

module.exports = function(path, args) {
    var $ = aliasCreateController(path, args);

    $.view = $.getView();
    ea.lib.query($.view);

    $.plugins = function() {
        _.each($.getViews(), function(view) { //these can be a view or a controller
            //console.log('!!!has plugin?', view.plugin, viewId, view.apiName);
            if (!view.plugin) {
                return;
            }
            ea.lib.query(view);
            var pluginNames = view.plugin.split(' ');
            _.each(pluginNames, function(pluginName) {
                //console.log('Processing plugin', pluginName);
                var plugin = null;

                var splits = pluginName.split('/');
                if (splits.length > 1) {
                    plugin = ea.plugins;
                    _.each(splits, function(split) {
                        plugin = plugin[s.camelize(split)];
                    });
                } else {
                    pluginName = s.camelize(pluginName);
                    plugin = ea.plugins[pluginName];
                }

                if (plugin) {
                    var viewId = view.id.indexOf('__alloyId') != -1 ? null : view.id;
                    if (viewId) {
                        var ref = $;
                        if (splits.length > 1) {
                            _.each(splits, function(split) {
                                split = s.camelize(split);
                                ref = ref[split] = ref[split] || {};
                            });
                        } else {
                            ref = ref[pluginName] = ref[pluginName] || {};
                        }

                        ref[viewId] = plugin({
                            view: view,
                            controller: $
                        });
                        //console.log('Loaded plugin ' + pluginName + ' for ' + pluginName + '.' + viewId);
                    } else {
                        plugin({
                            view: view,
                            controller: $
                        });
                        //console.log('Loaded plugin ' + pluginName);
                    }
                }
            });
        });

        return $;
    };

    var start = new Date().getTime();
    $.plugins();
    console.log('Plugins loaded in', (new Date().getTime() - start), 'ms for', $.__controllerPath);

    return $;
};