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
        }
    };
}]);
