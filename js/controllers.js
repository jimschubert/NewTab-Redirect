'use strict';
var controllers = angular.module('newTab.controllers', ['newTab.services']);

controllers.controller('MainController', ['$scope', 'Apps', 'Permissions', '$log',
    function ($scope, Apps, Permissions, $log){
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

    $scope.save_preferences = function(){
        $scope.show_prefs=false;
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

//    $scope.request = function(items) {
//        var requesting = items.split(',');
//        chrome.permissions.request({
//            permissions: requesting
//        }, function(allowed){
//            console.log(allowed);
//        });
//    };

//    $scope.toggle_permission = function(permission){
//        Permissions.toggle(permission);
//    };

//    function requestPermissions(rejection){
//        if(/permission$/.test(rejection)){
//            $scope.request_permissions = true;
//        }
//        console.log(rejection);
//    }

    function loadBookmarks() {
        return Apps.getBookmarksBar($scope.bookmark_count)
            .then(function (results) {
                if($scope.enable_bookmarks){
                    $scope.bookmarks = results;
                } else {
                    $scope.bookmarks = null;
                }
            }, function(rejected){
                $scope.bookmarks = null;
                if($scope.enable_bookmarks){
                    $log.warn('Retrieving bookmarks failed, but we thought we had permissions...', rejected);
                }
            });
    }

    function loadTopSites() {
        return Apps.topSites().then(function (sites) {
            if($scope.enable_top){
                $scope.top = sites.slice(0, $scope.top_count);
            } else {
                $scope.top = null;
            }
        }, function(rejected){
            $scope.top = null;
            if($scope.enable_top) {
                $log.warn('Retrieving topSites failed, but we thought we had permissions...', rejected);
            }
        });
    }

    function loadApps() {
        return Apps.getAll()
            .then(function(results){
                $scope.apps = results.filter(function(result){
                    return (/^(extension|theme)$/).test(result.type) === false;
                });
            });
    }

    $scope.$on('UninstalledApp', loadApps);

    // initial page setup
    Permissions.getAll()
        .then(function (permissions) {
            $scope.permissions = permissions;

            $scope.$on('PermissionRemoved', function(evt, changed){
                changed.forEach(function(permission){
                    $scope.permissions[permission] = false;
                });
            });
            $scope.$on('PermissionAdded', function(evt, changed){
                changed.forEach(function(permission){
                    $scope.permissions[permission] = true;
                });
            });
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
                .then(function () {
                    loadApps()
                        .then(function () {
                            loadBookmarks();
                            loadTopSites();
                        });
                });
        });
}]);
