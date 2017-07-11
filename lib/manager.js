var EventEmitter = require('events');

module.exports = function() {
    var manager = new EventEmitter();
    manager.trigger = manager.emit;
    return manager;
};
