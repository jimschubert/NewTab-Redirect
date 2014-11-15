(function(angular) {
    'use strict';

    /*global chrome*/
    var directives = angular.module('newTab.directives', ['newTab.services']);

    directives.directive('chromeApp', function () {
        return {
            // element only
            restrict: 'E',

            // app: http://developer.chrome.com/extensions/management#type-ExtensionInfo
            scope: {
                app: '=',
                permissions: '='
            },

            // replace the directive html with template html
            replace: true,

            // use the html in this template
            templateUrl: 'js/partials/application.html'
        };
    });

    directives.directive('chromeLaunch', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromeLaunch',
                type: '=chromeType',
                url: '=chromeHref'
            },

            link: function ($scope, $element, $attrs) {
                if ($scope.id) {
                    $element.bind('click', function (e) {
                        e.preventDefault();
                        if ($scope.type === 'packaged_app') {
                            Apps.launch($scope.id)
                                .then(function () {
                                    $log.debug("launched app id %s", $scope.id);
                                });
                        } else {
                            Apps.navigate($scope.url)
                                .then(function () {
                                    $log.debug("launched app id %s", $scope.id);
                                });
                        }
                    });
                }
            }
        };
    }]);

    directives.directive('chromePinned', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromePinned',
                url: '=chromeHref'
            },

            link: function ($scope, $element, $attrs) {
                if ($scope.id) {
                    $element.bind('click', function (e) {
                        e.preventDefault();
                        Apps.pinned($scope.url)
                            .then(function (tab) {
                                $log.debug("Opened app id %s in pinned tab #%d", $scope.id, tab.id);
                            });
                    });
                }
            }
        };
    }]);

    directives.directive('chromeNewTab', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromeNewTab',
                url: '=chromeHref'
            },

            link: function ($scope, $element, $attrs) {
                if ($scope.id) {
                    $element.bind('click', function (e) {
                        e.preventDefault();
                        Apps.tab($scope.url)
                            .then(function (tab) {
                                $log.debug("Opened app id %s in tab #%d", $scope.id, tab.id);
                            });
                    });
                }
            }
        };
    }]);

    directives.directive('chromeNewWindow', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromeNewWindow',
                url: '=chromeHref'
            },

            link: function ($scope, $element, $attrs) {
                if ($scope.id) {
                    $element.bind('click', function (e) {
                        e.preventDefault();
                        Apps.newWindow($scope.url)
                            .then(function (win) {
                                $log.debug("Opened app id %s in window #%d", $scope.id, win.id);
                            });
                    });
                }
            }
        };
    }]);

    directives.directive('chromeOptions', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromeOptions',
                url: '=chromeHref'
            },

            link: function ($scope, $element, $attrs) {
                if ($scope.id) {
                    $element.bind('click', function (e) {
                        e.preventDefault();
                        Apps.tab($scope.url)
                            .then(function (tab) {
                                $log.debug("Opened opens for app id %s in tab #%d", $scope.id, tab.id);
                            });
                    });
                }
            }
        };
    }]);

    directives.directive('chromeUninstall', ['$log', 'Apps', function ($log, Apps) {
        return {
            // attribute only
            restrict: 'A',

            scope: {
                id: '=chromeUninstall',
                name: '=chromeUninstallName'
            },

            replace: true,

            template: '<a title="Uninstall {{name}}" ng-click="uninstall()" class="special-href"><i class="fa fa-2x fa-trash-o"></i></a>',

            link: function ($scope) {
                $scope.uninstall = Apps.uninstall($scope.id);
            }
        };
    }]);

    directives.directive('togglePermission', ['Permissions', function (Permissions) {
        return {
            // element only
            restrict: 'E',

            scope: {
                permission: '@',
                enabled: '=granted'
            },
            replace: true,

            template: "<div><button ng-click=\"toggle()\">{{enabled?'Deny':'Grant'}} '{{permission}}' Permission</button></div>",

            link: function ($scope, $element, $attrs) {
                $scope.toggle = function () {
                    if ($scope.enabled) {
                        Permissions.revoke($scope.permission);
                    } else {
                        chrome.permissions.request({
                            permissions: [$scope.permission]
                        }, function (result) {
                            $scope.$apply(function () {
                                console.log(result);
                            });
                        });
                    }
                };
            }
        };
    }]);
})(angular);
