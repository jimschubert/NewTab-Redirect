(function(angular) {
    'use strict';

    var filters = angular.module('newTab.filters', []);

    filters.filter('iconsize', function () {
        return function (input, size, app) {
            size = 0 + size || 200;
            if (angular.isArray(input)) {
                var found,
                    current,
                    len = input.length,
                    i = 0;

                for (i; !found && i < len; i++) {
                    current = input[i];
                    if (current.size >= size) {
                        found = current;
                    }
                }

                found = found || current;
                if (found) {
                    var append = '';
                    if (app.enabled === false) {
                        append = '?grayscale=true';
                    } else if (navigator.onLine === false && app.offlineEnabled === false) {
                        append = '?grayscale=true';
                    }

                    return found.url + append;
                }
                return void 0;
            } else {
                return input;
            }
        };
    });
})(angular);
