var ea = require('express-app');

var async = require('async');
var _ = require('underscore');

module.exports = function(context) {
    var view = context.view;

    var $ = ea.lib.displayable(view);

    view.addEventListener('stack-pop', function(e) {
        $.pop();
        e.cancelBubble = true;
    });

    var controllers = [];

    var isPushing = false;

    $.id = view.id || '<not set>';
    $.view = view;

    $.push = function(controller, animated, callback) {
        if (isPushing) {
            return callback && callback();
        }
        isPushing = true;

        if (typeof animated === 'undefined') {
            animated = true;
        }
        if (typeof animated === 'function') {
            callback = animated;
            animated = true;
        }
        animated = animated && OS_IOS;

        var topController = $.top();

        if (topController) {
            view.remove(topController.getView());
        }

        controllers.push(controller);
        var controllerView = controller.getView();

        if (animated) {
            controllerView.opacity = 0.25;
        }

        view.add(controllerView);
        controller.trigger('push');

        if (animated) {
            controllerView.animate({
                opacity: 1,
                duration: 500
            }, function () {
                controllerView.opacity = 1;
                isPushing = false;
                callback && callback();
            });
        } else {
            isPushing = false;
            callback && callback();
        }
    };

    $.swap = function(controller, callback) {
        //console.log('!!swap length = '+ controllers.length);
        if (controller === $.top()) {
            return;
        }
        $.push(controller, false, function() {
            var removeIndex = controllers.length - 2;
            //console.log('!!removeIndex = '+ removeIndex);
            if (removeIndex >= 0) {
                view.remove(controllers[removeIndex].getView());
                controllers.splice(removeIndex, 1);
            }
            return callback && callback();
        });
    };

    $.swapAll = function(controller, callback) {
        //console.log('!!swapAll length = '+ controllers.length);
        if (controller === $.top()) {
            return;
        }
        var oldControllers = controllers;
        controllers = [];
        $.push(controller, false, function() {
            _.each(oldControllers, function(oldController) {
                view.remove(oldController.getView());
            });
            return callback && callback();
        });
    };

    var isPopping = false;
    $.pop = function(animated, callback) {
        if (isPopping || controllers.length < 1) {
            return callback && callback();
        }
        isPopping = true;

        if (typeof animated === 'undefined') {
            animated = true;
        }
        if (typeof animated === 'function') {
            callback = animated;
            animated = true;
        }
        animated = animated && OS_IOS;

        var controller = controllers.pop();
        var controllerView = controller.getView();

        view.remove(controllerView);
        controller.trigger('pop');

        var topController = $.top();
        if (topController) {
            var topView = topController.getView();

            if (animated) {
                topView.opacity = 0.25;
            }

            view.add(topView);
            topController.trigger('redisplay');

            if (animated) {
                topView.animate({
                    opacity: 1,
                    duration: 500
                }, function() {
                    topView.opacity = 1;
                    isPopping = false;
                    callback && callback();
                });
            } else {
                isPopping = false;
                callback && callback();
            }
        } else {
            isPopping = false;
            callback && callback();
        }
    };

    $.count = function() {
        return controllers.length;
    };

    $.top = function() {
        return (controllers.length > 0 && controllers[controllers.length - 1]) || null;
    };

    $.reset = function() {
        $.popTo(0);
    };

    $.popTo = function(index, callback) {
        async.whilst(function(){
            return controllers.length && (controllers.length > index);
        }, function(next){
            $.pop(false, next);
        }, function(err) {
            return callback && callback(err);
        });
    };

    return $;
};