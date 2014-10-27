(function(angular) {
    'use strict';
    var app = angular.module('newTab', ['newTab.controllers', 'newTab.directives', 'newTab.filters']);

    app.constant('IMAGE_SOURCES', /^\s*(https?|ftp|file|blob|chrome):|data:image\//);
    app.constant('ANCHOR_HREFS', /^\s*(https?|ftp|mailto|tel|file|chrome|about|chrome-extension):/);
    app.constant('ANCHOR_HREFS_REQ_UPDATE', /^\s*(file|chrome|chrome-extension):/);

    app.config(['$compileProvider', 'IMAGE_SOURCES', 'ANCHOR_HREFS',
        function ($compileProvider, IMAGE_SOURCES, ANCHOR_HREFS) {
            // see https://github.com/angular/angular.js/issues/3889
            $compileProvider.imgSrcSanitizationWhitelist(IMAGE_SOURCES);
            $compileProvider.aHrefSanitizationWhitelist(ANCHOR_HREFS);
        }]);

    app.run();
})(angular);