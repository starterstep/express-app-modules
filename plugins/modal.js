module.exports = function(context) {
    var view = context.view;

    var $ = {};
    var isClosing = false;
    var isOpen = false;

    view.addEventListener('modal-close', function(e) {
        $.close();
        e.cancelBubble = true;
    });

    $.open = function(callback) {
        if(isClosing) {
            closeNow();
        }
        setTimeout(function() {
            view.opacity = 0;
            view.visible = true;
            view.animate({
                opacity: 1,
                duration: 200
            }, function() {
                view.opacity = 1;
                isOpen = true;
                callback && callback();
            });
        }, 0);
    };

    $.close = function(callback) {
        isClosing = true;
        setTimeout(function() {
            if(isClosing) {
                view.animate({
                    opacity: 0,
                    duration: 200
                }, function() {
                    if(isClosing) {
                        closeNow();
                    }
                    callback && callback();
                });
            }
            else {
                callback && callback();
            }
        }, 50); //Delay the beginning of the close animation, in case we immediatly get a subsequent "open"
                //   Since open will force an immediate close (if closing) this delay avoids broken-looking
                //   animation due to what would have been conflicting animations
    };

    $.isOpen = function() {
        return isOpen;
    };

    var closeNow = function() {
        isClosing = false;
        view.opacity = 0;
        view.visible = false;
        isOpen = false;
    };

    return $;
};