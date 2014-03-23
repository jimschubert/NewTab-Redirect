'use strict';
var controllers = angular.module('newTab.controllers');

controllers.controller('OptionsController', ['$scope', 'Storage', 'Permissions', '$log', 'popularPages', 'internalPages',
    function ($scope, Storage, Permissions, $log, popularPages, internalPages){
        $scope.selected = 'url';
        $scope.popular = popularPages;
        $scope.internal = internalPages;

        function getUrl(){
            return Storage.getLocal(['syncOptions'])
                .then(function(result){
                    $scope.sync = result.syncOptions || result.syncOptions !== false;

                    return Storage[$scope.sync ? 'getSync' : 'getLocal'](['url']);
                })
                .then(function(result){
                    $scope.url = result.url;
                });
        }

        $scope.save = function(){
            if($scope.sync){
                Storage.saveSync({'url':$scope.url});
            } else {
                Storage.saveLocal({'url':$scope.url});
            }
        };

        $scope.quickSave = function(url, e){
            e.preventDefault();
            $scope.url = url;
            $scope.save();
        };

        $scope.cancel = function(){
            return getUrl();
        };

        $scope.changeSync = function(selected){
            Storage.saveLocal({'syncOptions':selected});
        };

        $scope.getSyncedUrl = function(){
            Storage.getSync(['url'])
                .then(function(result){
                    if(result.url === "") {
                        // this means the new tab redirect apps page
                        $scope.url = result.url;
                    } else if (result && result !== "") {
                        // this means there *is* a synced url, so we'll copy it over
                        $scope.url = result.url;
                    }
                })
                .then(function(){
                    $scope.save();
                });
        };

        getUrl();
    }
]);
