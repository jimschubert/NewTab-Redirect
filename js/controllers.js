'use strict';
var controllers = angular.module('newTab.controllers', ['newTab.services']);

controllers.controller('MainController', ['$scope', 'Apps', function ($scope, Apps){
    var enable_top_key = 'ntr.enable_top',
        enable_bookmarks_key = 'ntr.enable_bookmarks';

    $scope.extension_name = "New Tab Redirect!";
    $scope.enable_bookmarks = false;
    $scope.enable_top = false;
    $scope.bookmarks = [];

    $scope.save_top = function(){
        var obj = {};
        obj[enable_top_key] = $scope.enable_top;
        Apps.saveSetting(obj);
    };

    $scope.save_bookmarks = function(){
        var obj = {};
        obj[enable_bookmarks_key] = $scope.enable_bookmarks;
        Apps.saveSetting(obj);
    };

    function load() {
        Apps.getAll()
            .then(function(results){
                $scope.apps = results.filter(function(result){
                    return (/^(extension|theme)$/).test(result.type) === false;
                });
            });
    }

    load();

    Apps.topSites().then(function(sites){
        $scope.top = sites.slice(0,10);
    });

    Apps.getSetting([enable_top_key, enable_bookmarks_key])
        .then(function(settings){
            if(settings.hasOwnProperty(enable_bookmarks_key)) {
                $scope.enable_bookmarks = settings[enable_bookmarks_key]
            }

            if(settings.hasOwnProperty(enable_top_key)) {
                $scope.enable_top = settings[enable_top_key]
            }
        });

    Apps.getBookmarksBar()
        .then(function(results){
            $scope.bookmarks = results;
        });

    $scope.$on('UninstalledApp', load);
}]);
