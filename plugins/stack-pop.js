module.exports = function(context) {
    var view = context.view;
    var controller = context.controller;

    var firePop = function() {
        view.fireEvent('stack-pop', {bubbles:true});
        controller.trigger('stack-pop');
    };

    view.addEventListener('click', firePop);
};