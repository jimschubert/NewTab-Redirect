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

directives.directive('chromePinned', ['$log', 'Apps', function($log, Apps){
    return {
        // attribute only
        restrict: 'A',

        scope: {
            id: '=chromePinned',
            url: '=href'
        },

        link: function($scope, $element, $attrs) {
            if($scope.id){
                $element.bind('click', function(e){
                    e.preventDefault();
                    Apps.pinned($scope.url)
                        .then(function(tab){
                            $log.debug("Opened app id %s in pinned tab #%d", $scope.id, tab.id);
                        });
                });
            }
        }
    };
}]);

directives.directive('chromeNewWindow', ['$log', 'Apps', function($log, Apps){
    return {
        // attribute only
        restrict: 'A',

        scope: {
            id: '=chromeNewWindow',
            url: '=href'
        },

        link: function($scope, $element, $attrs) {
            if($scope.id){
                $element.bind('click', function(e){
                    e.preventDefault();
                    Apps.newWindow($scope.url)
                        .then(function(win){
                            $log.debug("Opened app id %s in window #%d", $scope.id, win.id);
                        });
                });
            }
        }
    };
}]);

directives.directive('chromeOptions', ['$log', 'Apps', function($log, Apps){
    return {
        // attribute only
        restrict: 'A',

        scope: {
            id: '=chromeOptions',
            url: '=href'
        },

        link: function($scope, $element, $attrs) {
            if($scope.id){
                $element.bind('click', function(e){
                    e.preventDefault();
                    Apps.tab($scope.url)
                        .then(function(tab){
                            $log.debug("Opened opens for app id %s in tab #%d", $scope.id, tab.id);
                        });
                });
            }
        }
    };
}]);

directives.directive('chromeUninstall', ['$log', 'Apps', function($log, Apps){
    return {
        // attribute only
        restrict: 'A',

        scope: {
            id: '=chromeUninstall'
        },

        link: function($scope, $element, $attrs) {
            if($scope.id){
                $element.bind('click', function(e){
                    e.preventDefault();
                    Apps.uninstall($scope.id)
                        .then(function(){
                            $log.debug("Uninstalled app id %s", $scope.id);
                        });
                });
            }
        }
    };
}]);
