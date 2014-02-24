'use strict';
/*global chrome*/
var directives = angular.module('newTab.directives', []);

directives.directive('chromeApp', function(){
    return {
        // element only
        restrict: 'E',

        // app: http://developer.chrome.com/extensions/management#type-ExtensionInfo
        scope: {
            app: '='
        },

        // replace the directive html with template html
        replace: true,

        // use the html in this template
        templateUrl: 'js/partials/application.html'
    };
});

directives.directive('chromeLaunch', ['$log', 'Apps', function($log, Apps){
    return {
        // attribute only
        restrict: 'A',

        scope: {
            id: '=chromeLaunch'
        },

        link: function($scope, $element, $attrs) {
            if($scope.id){
                $element.bind('click', function(e){
                    e.preventDefault();
                    Apps.launch($scope.id)
                        .then(function(){
                            $log.debug("launched app id %s", $scope.id);
                        });
                });
            }
        }
    };
}]);
