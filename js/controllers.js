(function(angular) {
    'use strict';
    var controllers = angular.module('newTab.controllers', ['newTab.services']);

    controllers.controller('MainController', ['$scope', 'Apps', 'Permissions', '$log', 'ANCHOR_HREFS_REQ_UPDATE',
        function ($scope, Apps, Permissions, $log, ANCHOR_HREFS_REQ_UPDATE) {
            var enable_top_key = 'ntr.enable_top',
                enable_bookmarks_key = 'ntr.enable_bookmarks',
                bookmarks_count_key = 'ntr.bookmark_count',
                top_count_key = 'ntr.top_count';

            $scope.extension_name = "New Tab Redirect!";
            $scope.enable_bookmarks = false;
            $scope.enable_top = false;
            $scope.bookmarks = [];
            $scope.show_prefs = false;
            $scope.bookmark_count = 10;
            $scope.top_count = 10;

            $scope.is_special_uri = function (url) {
                return ANCHOR_HREFS_REQ_UPDATE.test(url);
            };

            $scope.navigate = function (url) {
                Apps.navigate(url);
            };

            $scope.save_preferences = function () {
                $scope.show_prefs = false;
                // $scope.request_permissions = false;

                var obj = {};
                obj[enable_bookmarks_key] = $scope.enable_bookmarks;
                obj[enable_top_key] = $scope.enable_top;
                obj[bookmarks_count_key] = $scope.bookmark_count;
                obj[top_count_key] = $scope.top_count;
                Apps.saveSetting(obj);

                // reload bookmarks and topSites
                loadBookmarks();
                loadTopSites();
            };

            function loadBookmarks() {
                return Apps.getBookmarksBar($scope.bookmark_count)
                    .then(function (results) {
                        if ($scope.enable_bookmarks) {
                            $scope.bookmarks = results;
                        } else {
                            $scope.bookmarks = null;
                        }
                    }, function (rejected) {
                        $scope.bookmarks = null;
                        if ($scope.enable_bookmarks) {
                            $log.warn('Retrieving bookmarks failed, but we thought we had permissions...', rejected);
                        }
                    });
            }

            function loadTopSites() {
                return Apps.topSites().then(function (sites) {
                    if ($scope.enable_top) {
                        $scope.top = sites.slice(0, $scope.top_count);
                    } else {
                        $scope.top = null;
                    }
                }, function (rejected) {
                    $scope.top = null;
                    if ($scope.enable_top) {
                        $log.warn('Retrieving topSites failed, but we thought we had permissions...', rejected);
                    }
                });
            }

            function loadApps() {
                return Apps.getAll()
                    .then(function (results) {
                        $scope.apps = results.filter(function (result) {
                            return (/^(extension|theme)$/).test(result.type) === false;
                        });
                    });
            }

            $scope.$on('UninstalledApp', loadApps);

            // initial page setup
            Permissions.getAll()
                .then(function (permissions) {
                    $scope.permissions = permissions;
                })
                .then(function () {
                    var querySettings = [enable_top_key, enable_bookmarks_key, bookmarks_count_key, top_count_key];
                    Apps.getSetting(querySettings)
                        .then(function (settings) {
                            angular.forEach(querySettings, function (val) {
                                if (settings.hasOwnProperty(val)) {
                                    // because we expect the keys to be in format ntr.[property_name]
                                    var scopeKey = val.replace('ntr.', '');
                                    $scope[scopeKey] = settings[val];
                                }
                            });

                            // define defaults for properties without settings (initial load) here. This helps prevent UI flickering.
                            if (angular.isUndefined(settings[enable_bookmarks_key])) {
                                $scope.enable_bookmarks = true;
                            }

                            if (angular.isUndefined(settings[enable_top_key])) {
                                $scope.enable_top = true;
                            }
                        })
                        .then(function setupWatches() {
                            $scope.$watch('bookmark_count', loadBookmarks);
                            $scope.$watch('top_count', loadTopSites);
                        })
                        .then(bootstrap)
                        .then(function watchForPermissionsChanges() {
                            // This responds to any permissions change events and loads everything to reflect changed permissions.
                            // permissions can only be changed by a physical user action (click link, check box)
                            // so responding to events and calling bootstrap here won't hurt.
                            $scope.$on('PermissionRemoved', function (evt, changed) {
                                changed.forEach(function (permission) {
                                    $scope.permissions[permission] = false;
                                });

                                bootstrap();
                            });
                            $scope.$on('PermissionAdded', function (evt, changed) {
                                changed.forEach(function (permission) {
                                    $scope.permissions[permission] = true;
                                });

                                if (-1 !== changed.indexOf('management')) {
                                    Apps.duplicate();
                                }

                                bootstrap();
                            });
                        });
                });

            function bootstrap() {
                loadApps()
                    .then(function () {
                        loadBookmarks();
                        loadTopSites();
                    });
            }
        }]);

})(angular);