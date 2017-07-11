module.exports = function(view) {
    var debugCount = 0;

    var views = [view];

    var doTraversal = function(views, matches, first, results) {
        //console.log('!!!Traversal ', ++debugCount);

        var view, children;
        for (var i = 0; i < views.length; i++) {
            view = views[i];

            if (matches(view)) {
                module.exports(view);
                results.push(view);
                if (first) {
                    return false;
                }
            }
            children = view.children || [];
            //console.log('view.children = ', view.children);
            // if (view.getData && view.getData()) {
            //     children = children.concat(view.getData());
            // }
            // if (view.getRows && view.getRows()) {
            //     children = children.concat(view.getRows());
            // }
            if (!doTraversal(children, matches, first, results)) {
                return false;
            }
        }
        return true;
    };

    var doFind = function(views, matches, first) {
        var results = [];
        doTraversal(views, matches, first, results);
        return results;
    };

    view.find = function(matches) {
        debugCount = 0;
        if (typeof matches === 'string') {
            return view.first(matches);
        }
        return doFind(views, matches, false);
    };

    view.first = function(matches) {
        debugCount = 0;
        if (typeof matches === 'string') {
            var splits = matches.split('#');
            if (splits.length < 2) {
                return [];
            }
            var id = splits[1];
            matches = function(view) {
                return view.id === id;
            };
        }
        return doFind(views, matches, true);
    };

    return view;
};