'use strict';
var controllers = angular.module('newTab.controllers', ['newTab.services']);

controllers.controller('MainController', ['$scope', 'Apps', function ($scope, Apps){
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
        var obj = {};
        obj[enable_bookmarks_key] = $scope.enable_bookmarks;
        obj[enable_top_key] = $scope.enable_top;
        obj[bookmarks_count_key] = $scope.bookmark_count;
        obj[top_count_key] = $scope.top_count;
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

    var querySettings = [enable_top_key, enable_bookmarks_key, bookmarks_count_key, top_count_key];
    Apps.getSetting(querySettings)
        .then(function(settings){
            angular.forEach(querySettings, function(val){
                if(settings.hasOwnProperty(val)) {
                    var scopeKey = val.replace('ntr.','');
                    $scope[scopeKey] = settings[val];
                }
            });
        });

    $scope.$watch('bookmark_count', function(newValue){
        Apps.getBookmarksBar(newValue)
            .then(function(results){
                $scope.bookmarks = results;
            });
    });

    $scope.$watch('top_count', function(newValue){
        Apps.topSites().then(function(sites){
            $scope.top = sites.slice(0,newValue);
        });
    });

    $scope.$on('UninstalledApp', load);
}]);
