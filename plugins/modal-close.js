module.exports = function(context) {
    var view = context.view;

    var fireClose = function() {
        view.fireEvent('modal-close', {bubbles:true});
    };

    view.addEventListener('click', fireClose);
};