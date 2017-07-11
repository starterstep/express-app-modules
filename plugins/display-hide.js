module.exports = function(context) {
    var view = context.view;

    view.addEventListener('click', function() {
        view.fireEvent('display-hide', {bubbles:true});
    });
};