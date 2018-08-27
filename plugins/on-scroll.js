var Emitter = require('events');

module.exports = function(context) {
    var tableView = context.view;

    var $ = new Emitter();

    var disabled = false;
    var totalItemCount = null;
    var firstVisibleItem = null;
    var visibleItemCount = null;

    var lastContentSizeHeight = 0;
    var lastScrollY = 0;
    var lastTotalItemCount = 0;
    var lastVisibleItem = 0;
    var topAway = false;
    var top = true;

    tableView.addEventListener('scroll', function(e) {
        if (disabled) {
            return;
        }

        if (OS_IOS && e.contentOffset) {
            var sizeHeight = e.size.height;
            var contentSizeHeight = e.contentSize.height;
            var contentOffsetY = e.contentOffset.y;

            //console.log('e.size.height ', e.size.height);
            //console.log('e.contentSize.height ', contentSizeHeight);
            //console.log('e.contentOffset.y ', contentOffsetY);

            var incrementingY = (contentOffsetY - lastScrollY) > 0;
            lastScrollY = contentOffsetY;

            if (incrementingY && (contentOffsetY > (sizeHeight)) && !topAway) {
                topAway = true;
                top = false;
                $.emit('top-away');
            } else if (!incrementingY && (contentOffsetY < 100) && !top) {
                top = true;
                topAway = false;
                $.emit('top');
            }

            if (contentSizeHeight > lastContentSizeHeight) {
                if (incrementingY && ((contentOffsetY + (sizeHeight*1.5)) > contentSizeHeight)) {
                    lastContentSizeHeight = contentSizeHeight;
                    $.emit('bottom');
                }
            }
        }
        if (OS_ANDROID) {
            totalItemCount = e.totalItemCount;
            firstVisibleItem = e.firstVisibleItem;
            visibleItemCount = e.visibleItemCount;
            //console.log('totalItemCount ', totalItemCount)
            //console.log('lastVisibleItem ', lastVisibleItem)
            //console.log('firstVisibleItem ', firstVisibleItem)
            //console.log('visibleItemCount ', visibleItemCount, '\n\n')

            if (firstVisibleItem !== lastVisibleItem) {
                if (firstVisibleItem === 1 && !top) {
                    top = true;
                    topAway = false;
                    $.emit('top');
                } else if (firstVisibleItem > (visibleItemCount-1) && !topAway) {
                    topAway = true;
                    top = false
                    $.emit('top-away');
                }
                lastVisibleItem = firstVisibleItem;
            }

            if (totalItemCount > lastTotalItemCount) {
                var items = firstVisibleItem + visibleItemCount + 5;
                if (totalItemCount < items) {
                    lastTotalItemCount = totalItemCount;
                    $.emit('bottom');
                }
            }
        }
    });

    $.reset = function() {
        disabled = false;
        lastContentSizeHeight = 0;
        lastScrollY = 0;
        lastTotalItemCount = 0;
        lastVisibleItem = 0;
        topAway = false;
        top = true;
        $.removeAllListeners();
    };

    $.disable = function() {
        disabled = true;
    };

    $.enable = function() {
        disabled = false;
    };

    return $;
};