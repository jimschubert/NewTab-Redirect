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
        },

        topSites: function(){
            var deferred = $q.defer();
            chrome.topSites.get(function(sites){
                // sites is [{url:"",title:""}]
                deferred.resolve(sites);
            });
            return deferred.promise;
        },

        saveSetting: function(obj){
            var deferred = $q.defer();
            if(angular.isObject(obj) === false || Object.keys(obj).length === 0) {
                deferred.reject();
            } else {
                chrome.storage.sync.set(obj, function() {
                    deferred.resolve();
                });
            }
            return deferred.promise;
        },

        getSetting: function(obj) {
            var query = [];
            var deferred = $q.defer();
            if(angular.isArray(obj) === false && typeof obj === 'string' && obj !== "") {
                query.push(obj);
            } else if (angular.isArray(obj)){
                if(obj.length === 0) { deferred.reject(); }
                else { query = query.concat(obj); }
            }

            chrome.storage.sync.get(query, function(settings) {
                deferred.resolve(settings);
            });
            return deferred.promise;
        },

        getBookmarksBar: function(limit){
            limit = limit || 10;
            function linksOnly(item){
                return item.url;
            }

            var deferred = $q.defer();
            chrome.bookmarks.search('Bookmarks Bar', function(results){
                if(results.length <= 0) {
                    deferred.reject();
                } else {
                    chrome.bookmarks.getChildren(results[0].id, function(results) {
                        deferred.resolve(results.filter(linksOnly).splice(0, limit));
                    });
                }
            });
            return deferred.promise;
        }
    };
}]);
