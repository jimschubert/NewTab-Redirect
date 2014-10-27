(function(angular) {
    'use strict';

    /*global chrome*/
    var services = angular.module('newTab.services', []);

    services.service('Permissions', ['$rootScope', '$q', '$log', function ($rootScope, $q, $log) {
        var definedOptionalPermissions = chrome.runtime.getManifest().optional_permissions;
        var definedRequiredPermissions = chrome.runtime.getManifest().permissions;

        chrome.permissions.onAdded.addListener(function (permission) {
            $rootScope.$broadcast("PermissionAdded", permission.permissions);
        });

        chrome.permissions.onRemoved.addListener(function (permission) {
            $rootScope.$broadcast("PermissionRemoved", permission.permissions);
        });

        var convert = function (chromePermission) {
            var permissions = {};
            definedOptionalPermissions.forEach(function (item) {
                permissions[item] = false;
            });
            chromePermission.permissions.map(function (elem) {
                permissions[elem] = true;
            });
            return permissions;
        };

        return {
            REQUIRED: definedRequiredPermissions,
            OPTIONAL: definedOptionalPermissions,
            getAll: function () {
                var deferred = $q.defer();
                chrome.permissions.getAll(function (results) {
                    if (chrome.runtime.lastError) {
                        return $rootScope.$apply(function () {
                            $log.error(chrome.runtime.lastError.message);
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(convert(results));
                    });
                });
                return deferred.promise;
            },
            check: function (permission) {
                var deferred = $q.defer();

                chrome.permissions.contains({
                    permissions: [permission]
                }, function (permissionStatus) {
                    if (chrome.runtime.lastError) {
                        return $rootScope.$apply(function () {
                            $log.error(chrome.runtime.lastError.message);
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(permissionStatus);
                    });
                });

                return deferred.promise;
            },
            revoke: function (permission) {
                var deferred = $q.defer();

                chrome.permissions.remove({
                    permissions: [permission]
                }, function (removed) {
                    if (chrome.runtime.lastError) {
                        return $rootScope.$apply(function () {
                            $log.error(chrome.runtime.lastError.message);
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(removed);
                    });
                });

                return deferred.promise;
            }
        };
    }]);

    services.service('Apps', ['$rootScope', '$q', '$log', 'Permissions', 'Storage', function ($rootScope, $q, $log, Permissions, Storage) {
        var verify = function (permission, cb) {
            chrome.permissions.contains({
                permissions: [permission]
            }, cb);
        };

        return {
            getAll: function () {
                var deferred = $q.defer();
                verify('management', function (allowed) {
                    if (!allowed) {
                        return $rootScope.$apply(function () {
                            deferred.reject('management permission');
                        });
                    }

                    return chrome.management.getAll(function (results) {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        return $rootScope.$apply(function () {
                            deferred.resolve(results);
                        });
                    });
                });

                return deferred.promise;
            },

            launch: function (id) {
                var deferred = $q.defer();
                verify('management', function (allowed) {
                    if (!allowed) {
                        return $rootScope.$apply(function () {
                            deferred.reject('management permission');
                        });
                    }
                    return chrome.management.launchApp(id, function () {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        return $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                });
                return deferred.promise;
            },

            pinned: function (url) {
                var deferred = $q.defer();
                chrome.tabs.create({pinned: true, url: url}, function (tab) {
                    if (chrome.runtime.lastError) {
                        $log.error(chrome.runtime.lastError.message);
                        return $rootScope.$apply(function () {
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(tab);
                    });
                });
                return deferred.promise;
            },

            newWindow: function (url) {
                var deferred = $q.defer();

                // window create is in tabs permission for some reason
                verify('tabs', function (allowed) {
                    if (!allowed) {
                        return $rootScope.$apply(function () {
                            deferred.reject('tabs permission');
                        });
                    }
                    return chrome.windows.create({focused: true, url: url}, function (window) {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        return $rootScope.$apply(function () {
                            deferred.resolve(window);
                        });
                    });
                });
                return deferred.promise;
            },

            /**
             * Uninstall factory. This function requires a factory because uninstall requires a user gesture. The returned
             * function must be bound to an HTML element's click event (or an angular ng-click), so no promises.
             *
             * @param id
             * @returns {Function}
             */
            uninstall: function (id) {
                return function () {
                    // no need to verify permissions here, because the runtime error will display this.
                    return chrome.management.uninstall(id, {showConfirmDialog: true}, function () {
                        if (chrome.runtime.lastError) {
                            $log.error('Could not uninstall app id %s because: %s', id, chrome.runtime.lastError.message);
                        }

                        $log.warn('Uninstalled app id %s.', id);
                        $rootScope.$broadcast('UninstalledApp');
                    });
                };
            },

            tab: function (url) {
                var deferred = $q.defer();
                chrome.tabs.create({active: true, url: url}, function (tab) {
                    if (chrome.runtime.lastError) {
                        $log.error(chrome.runtime.lastError.message);
                        return $rootScope.$apply(function () {
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(tab);
                    });
                });
                return deferred.promise;
            },

            duplicate: function (id, keepOriginal) {
                var deferred = $q.defer();
                chrome.tabs.getCurrent(function (current) {
                    var target = id || current.id;
                    chrome.tabs.duplicate(target, function (tab) {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        if (!keepOriginal) {
                            chrome.tabs.remove(target);
                        }
                        return $rootScope.$apply(function () {
                            deferred.resolve(tab);
                        });
                    });
                });
                return deferred.promise;
            },

            navigate: function (url) {
                var deferred = $q.defer();
                chrome.tabs.update({active: true, url: url}, function (tab) {
                    if (chrome.runtime.lastError) {
                        $log.error(chrome.runtime.lastError.message);
                        return $rootScope.$apply(function () {
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(tab);
                    });
                });
                return deferred.promise;
            },

            topSites: function () {
                var deferred = $q.defer();

                Permissions.check('topSites')
                    .then(function success(allowed) {
                        if (!allowed) {
                            deferred.reject('topSites permission');
                        } else {
                            chrome.topSites.get(function (sites) {
                                if (chrome.runtime.lastError) {
                                    $log.error(chrome.runtime.lastError.message);
                                    return $rootScope.$apply(function () {
                                        deferred.reject(chrome.runtime.lastError.message);
                                    });
                                }

                                // sites is [{url:"",title:""}]
                                return $rootScope.$apply(function () {
                                    deferred.resolve(sites);
                                });
                            });
                        }
                    }, function failure() {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            saveSetting: Storage.saveSync,

            getSetting: Storage.getSync,

            getBookmarksBar: function (limit) {
                limit = limit || 10;
                function linksOnly(item) {
                    return item.url;
                }

                var deferred = $q.defer();
                Permissions.check('bookmarks')
                    .then(function success(allowed) {
                        if (!allowed) {
                            deferred.reject();
                        } else {
                            chrome.bookmarks.getSubTree('0', function (results) {
                                if (results.length <= 0) {
                                    $rootScope.$apply(function () {
                                        deferred.reject();
                                    });
                                } else {
                                    // Can't pull by title (not localized)
                                    // Assumption is that id:1 = Bookmarks Bar, id:2 = Other Bookmarks, id:3 = Mobile Bookmarks
                                    var bookmarks = results[0].children.filter(function (x) {
                                        return x.id === '1';
                                    });
                                    if (bookmarks.length === 0) {
                                        $rootScope.$apply(function () {
                                            deferred.resolve([]);
                                        });
                                    } else {
                                        chrome.bookmarks.getChildren(bookmarks[0].id, function (results) {
                                            $rootScope.$apply(function () {
                                                deferred.resolve(results.filter(linksOnly).splice(0, limit));
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    }, function failure() {
                        deferred.reject();
                    });
                return deferred.promise;
            }
        };
    }]);

    services.service('Storage', ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
        return {

            saveSync: function (obj) {
                var deferred = $q.defer();
                if (angular.isObject(obj) === false || Object.keys(obj).length === 0) {
                    deferred.reject();
                } else {
                    chrome.storage.sync.set(obj, function () {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        return $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                }
                return deferred.promise;
            },

            getSync: function (obj) {
                var query = [];
                var deferred = $q.defer();
                if (angular.isArray(obj) === false && typeof obj === 'string' && obj !== "") {
                    query.push(obj);
                } else if (angular.isArray(obj)) {
                    if (obj.length === 0) {
                        deferred.reject();
                    }
                    else {
                        query = query.concat(obj);
                    }
                }

                chrome.storage.sync.get(query, function (settings) {
                    if (chrome.runtime.lastError) {
                        $log.error(chrome.runtime.lastError.message);
                        return $rootScope.$apply(function () {
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(settings);
                    });
                });
                return deferred.promise;
            },

            saveLocal: function (obj) {
                var deferred = $q.defer();
                if (angular.isObject(obj) === false || Object.keys(obj).length === 0) {
                    deferred.reject();
                } else {
                    chrome.storage.local.set(obj, function () {
                        if (chrome.runtime.lastError) {
                            $log.error(chrome.runtime.lastError.message);
                            return $rootScope.$apply(function () {
                                deferred.reject(chrome.runtime.lastError.message);
                            });
                        }

                        return $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                }
                return deferred.promise;
            },

            getLocal: function (obj) {
                var query = [];
                var deferred = $q.defer();
                if (angular.isArray(obj) === false && typeof obj === 'string' && obj !== "") {
                    query.push(obj);
                } else if (angular.isArray(obj)) {
                    if (obj.length === 0) {
                        deferred.reject();
                    }
                    else {
                        query = query.concat(obj);
                    }
                }

                chrome.storage.local.get(query, function (settings) {
                    if (chrome.runtime.lastError) {
                        $log.error(chrome.runtime.lastError.message);
                        return $rootScope.$apply(function () {
                            deferred.reject(chrome.runtime.lastError.message);
                        });
                    }

                    return $rootScope.$apply(function () {
                        deferred.resolve(settings);
                    });
                });
                return deferred.promise;
            }
        };
    }]);

})(angular);