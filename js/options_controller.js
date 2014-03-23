'use strict';
var controllers = angular.module('newTab.controllers');

controllers.controller('OptionsController', ['$scope', 'Storage', 'Permissions', '$log', 'popularPages', 'internalPages',
    function ($scope, Storage, Permissions, $log, popularPages, internalPages){
        $scope.selected = 'url';
        $scope.popular = popularPages;
        $scope.internal = internalPages;
        $scope.optional_permissions = Permissions.OPTIONAL;
        $scope.required_permissions = Permissions.REQUIRED;

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

        function getPermissions(){
            return Permissions.getAll()
                .then(function(permissions){
                    $scope.permissions = permissions;
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

        $scope.grant = function(permission){
            chrome.permissions.request({
                permissions: [permission]
            }, function(result){
                $scope.$apply(function(){
                    console.log(result);
                });
            });
        };

        $scope.deny = function(permission){
            Permissions.revoke(permission);
        };

        $scope.$on('PermissionRemoved', function(evt, changed){
            if(!angular.isObject($scope.permissions)) { return; }
            changed.forEach(function(permission){
                $scope.permissions[permission] = false;
            });
            getPermissions();
        });
        $scope.$on('PermissionAdded', function(evt, changed){
            if(!angular.isObject($scope.permissions)) { return; }
            changed.forEach(function(permission){
                $scope.permissions[permission] = true;
            });
            getPermissions();
        });

        getUrl();
        getPermissions();
    }
]);
