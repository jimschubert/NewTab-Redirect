'use strict';
var controllers = angular.module('newTab.controllers', ['newTab.services']);

controllers.controller('MainController', ['$scope', 'Apps', function ($scope, Apps){
    // TODO: Localize this
    $scope.extension_name = "New Tab Redirect!";
    Apps.getAll()
        .then(function(results){
            $scope.apps = results.filter(function(result){
                return (/^(extension|theme)$/).test(result.type) === false;
            });
        });
}]);
