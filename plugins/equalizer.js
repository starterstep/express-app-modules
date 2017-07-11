var _ = require('underscore');

var ea = require('express-app');

module.exports = function(context) {
    var equalizerParentView = context.view;
    var $ = {};

    //Find all sub views w/ 'equalizer-watch' so we can keep heights equal
    var watchViews = equalizerParentView.find(function(view) {
        return view.plugin && view.plugin.indexOf('equalizer-watch') != -1;
    });


    //Watch 'postlayout' event for each watched view
    _.forEach(watchViews, function(watchView, idx) {
        watchView.addEventListener('postlayout', function(event) {
            onWatchViewPostlayout(idx, watchView.size.height);
        });
    });

    //Constants & State Vars
    var STATE = {
        'IDLE': 0,
        'WATCH': 1,
        'CAPTURING': 2,
        'EQUALIZING': 3
    };
    var CAPTURE_WINDOW_MILLIS = 100;
    var POST_EQUALIZE_WINDOW_MILLIS = 100;

    var state = STATE.WATCH;
    var equalizeInfo = {
        height: 0,
        capturedIndexes: {}
    };
    var captureTimer = null;

    //Respond to each watched view's postlayout depending on state
    var onWatchViewPostlayout = function(watchViewIdx, watchViewHeight) {
        // console.log('### equalizer ###', 'onWatchViewPostlayout:', 'state', state, 'watchViewIdx', watchViewIdx, 'watchViewHeight', watchViewHeight);
        if(state === STATE.WATCH) {
            //Start capture
            state = STATE.CAPTURING;
            equalizeInfo.height = watchViewHeight > equalizeInfo.height ? watchViewHeight : equalizeInfo.height;
            equalizeInfo.capturedIndexes = {};
            equalizeInfo.capturedIndexes[watchViewIdx] = 1;
            //Set capture timeout for finalizing equalization after a window of capturing
            captureTimer = setTimeout(equalizeNow, CAPTURE_WINDOW_MILLIS);
        }
        else if(state === STATE.CAPTURING) {
            //Capture next watched view height
            equalizeInfo.height = watchViewHeight > equalizeInfo.height ? watchViewHeight : equalizeInfo.height;
            equalizeInfo.capturedIndexes[watchViewIdx] = 1;
            //Reset the capture timer since we got another watched view postlayout event
            clearTimeout(captureTimer);
            captureTimer = setTimeout(equalizeNow, CAPTURE_WINDOW_MILLIS);
        }
        else if(state === STATE.EQUALIZING) {
            //Intentionally ignore postlayout's while in this state
        }
    };

    //Set each watched view to the equalized height
    var equalizeNow = function() {
        // console.log('### equalizer ###', 'equalizeNow');
        //Equalize height of each watched view now
        state = STATE.EQUALIZING;
        _.forEach(watchViews, function(watchView, idx) {
            if(watchView.size.height < equalizeInfo.height && watchView.getHeight() != equalizeInfo.height) {
                // console.log('### equalizer ###', 'equalizing: ' + idx + ' to ' + equalizeInfo.height);
                watchView.setHeight(equalizeInfo.height);
            }
        });
        //Set a timeout period to ignore postlayout events coming as a result of equalizing height, then resume watch state
        setTimeout(function() {
            state = STATE.WATCH;
        }, POST_EQUALIZE_WINDOW_MILLIS);
    };

    return $;
};