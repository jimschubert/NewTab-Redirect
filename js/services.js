'use strict';
/*global chrome*/
var services = angular.module('newTab.services', []);

services.service('Apps', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
        getAll: function () {
            var deferred = $q.defer();

            chrome.management.getAll(function (results) {
                $rootScope.$apply(function(){
                    deferred.resolve(results);
                });
            });

            return deferred.promise;
        },

        launch: function(id){
            var deferred = $q.defer();
            chrome.management.launchApp(id, function(){
                deferred.resolve();
            });
            return deferred.promise;
        },

        pinned: function(url){
            var deferred = $q.defer();
            chrome.tabs.create({pinned:true, url: url}, function(tab){
                deferred.resolve(tab);
            });
            return deferred.promise;
        },

        newWindow: function(url){
            var deferred = $q.defer();
            chrome.windows.create({focused:true, url: url}, function(window){
                deferred.resolve(window);
            });
            return deferred.promise;
        },

        uninstall: function(id){
            var deferred = $q.defer();
            chrome.management.uninstall(id, {showConfirmDialog: true}, function(){
                $rootScope.$broadcast('UninstalledApp');
                deferred.resolve();
            });
            return deferred.promise;
        },

        tab: function(url){
            var deferred = $q.defer();
            chrome.tabs.create({active:true, url: url}, function(tab){
                deferred.resolve(tab);
            });
            return deferred.promise;
        }
    };
}]);
