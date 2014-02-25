'use strict';
var controllers = angular.module('newTab.controllers', ['newTab.services']);

controllers.controller('MainController', ['$scope', 'Apps', function ($scope, Apps){
    $scope.extension_name = "New Tab Redirect!";
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

    $scope.$on('UninstalledApp', load);
}]);
