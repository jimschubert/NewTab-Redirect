'use strict';
// Setting the window.name property in this way allows us to call app.run(), but block until it's ready to be resumed.
// the resume happens in redirect.js if no redirected new tab url has been specified.
window.name = 'NG_DEFER_BOOTSTRAP!';
var app = angular.module('newTab', ['newTab.controllers', 'newTab.directives', 'newTab.filters']);

app.config(['$compileProvider', function($compileProvider) {
    // see https://github.com/angular/angular.js/issues/3889
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|chrome):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|chrome|chrome-extension):/);
}]);

app.run();
