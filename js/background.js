/*global chrome*/
'use strict';
var slice = Array.prototype.slice;
var manifest = chrome.runtime.getManifest();
var allOptions = ["usingStorageApi", "url", "syncOptions", "lastInstall", "showWelcome", "upgrade_3.1", "always-tab-update"];

function log(){
    var args = slice.call(arguments);
    var msg = args.shift();
    msg = "(%s) " + msg;
    args.unshift(manifest.version);
    args.unshift(msg);

    console.log.apply(console, args);
}

function init() {
    log("background.js: init()");
}

function saveInitial() {
    log("background.js: Initial setup.");
    var options = {};
    var arr = window.localStorage.options;
    if (arr) {
        log('Found options on localStorage');
        options = JSON.parse(arr);
    }

    // by default, initial installs won't sync options
    options["syncOptions"] = false;
    options["usingStorageApi"] = true;
    options["showWelcome"] = true;

    if (!options.url) {
        log("Using default New Tab Redirect page");
        // this defaults to the New Tab Redirect Apps page
        options.url = "";
    }

    options["lastInstall"] = +new Date();

    log("trying to save these options", options);
    save(options, "local");
}

// When installed, show welcome page
chrome.runtime.onInstalled.addListener(function (details) {

    var current = +new Date();
    var sixMonths = 15894000000; // milliseconds = 6.04 months.

    if (details.reason === "chrome_update") {
        return void 0;
    } else if (details.reason === "install" || details.reason === "update") {
        return retrieve(allOptions, "local", function (localQuery) {
            return retrieve(allOptions, "sync", function (query) {
                var canShowWelcome = true;
                log("Pulled sync options:", query);

                if((0+query.lastInstall) > 1){
                    var installed = parseInt(query.lastInstall, 10);

                    // 500s buffer between install and running listener should be safe
                    var listener5sBuffer = Math.abs(installed - current);
                    var listener5sBufferCheck = (listener5sBuffer > 500000);

                    // we must wait at least 6 months to show welcome page again
                    var installDiff = (current - installed);
                    var sixMonthCheck = (installDiff > sixMonths);

                    canShowWelcome =  listener5sBufferCheck && sixMonthCheck;

                    log(
                        'Can we show welcome by checks?(%s), ' +
                        'Installed: %d, %d ms between last install and listener, ' +
                        '%d ms since last install',
                        canShowWelcome, installed, listener5sBuffer, installDiff);
                }

                if (localQuery.showWelcome == false || query.showWelcome == false) {
                    log("User doesn't ever want to see the welcome page. canShowWelcome=false");
                    canShowWelcome = false;
                }

                var options = {};

                // user previously installed on another machine, either sync or do initial setup
                if (query["syncOptions"]) {
                    log("saving sync option setup");
                    allOptions.forEach(function (elem) {
                        options[elem] = query[elem];
                    });

                    options["lastInstall"] = current;
                    save(options, "local");
                } else if(details.reason === "install") {
                    // User hasn't previously installed, save defaults
                    log("saving initial setup (not syncing)");
                    saveInitial();
                }

                // be sure to save when we last installed (or updated)
                save({ "lastInstall": +new Date() }, "sync");

                // only display the upgrade message once, and only for true upgrades
                if((manifest.version === "3.1" || manifest.version === "3.1.1" ) && details.reason === "update" && !localQuery["upgrade_3.1"]) {
                    log("background.js: showing v3.1 important upgrade message");
                    save({ "upgrade_3.1": true }, "local");
                    return chrome.tabs.create({"url": "upgraded/3.1.html" });
                }

                log("Try to show welcome on %s: %s (should only show on install)", details.reason, canShowWelcome);
                // on initial install, or every 6 months, show Welcome Page
                if (canShowWelcome && details.reason === "install") {
                    log("background.js: showing welcome page");
                    return chrome.tabs.create({"url": "welcome.html" });
                }
            });
        });
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    retrieve("syncOptions", "local", function (items) {
        if (items.syncOptions == "false" || namespace != "sync") return;

        var saveObj = {};
        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                var change = changes[key];
                log('background.js: "%s|%s" changed. "%s" -> "%s"',
                    namespace,
                    key,
                    change.oldValue,
                    change.newValue);

                saveObj[key] = change.newValue;
            }
        }
        if(Object.keys(saveObj).length > 0) {
            log("Saving sync values locally");
            save(saveObj, "local");
        }
    });
});

function save(items, area) {
    chrome.storage.local.get(["syncOptions"], function (localQuery) {
        if (localQuery.syncOptions == false) {
            // if user doesn't want to save, we'll always sync to local
            area = "local";
        }

        log("Saving the following items to " + area + ":", items);
        chrome.storage[area].set(items);
    });
}

function retrieve(items, area, cb) {
    if ("function" !== typeof cb) {
        cb = function (items) {
            log("items:", items);
        };
    }

    chrome.storage[area].get(items, cb);
}

init();
