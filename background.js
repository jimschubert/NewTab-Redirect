var allOptions = ["usingStorageApi", "url", "syncOptions", "lastInstall", "showWelcome"];
function init() {
    console.log("background.js: init()");
}

function saveInitial() {
    console.log("background.js: Initial setup.");
    var options = {};
    var arr = window.localStorage.options;
    if (arr) {
        options = JSON.parse(arr);
    }

    // by default, initial installs won't sync options
    options["syncOptions"] = false;
    options["usingStorageApi"] = true;
    options["showWelcome"] = true;

    if (!options.url) {
        options.url = chrome.extension.getURL("options.html");
    }

    options["lastInstall"] = +new Date();

    console.log("trying to save these options", options);
    save(options, "local");
}

// When installed, show welcome page
chrome.runtime.onInstalled.addListener(function (details) {

    var current = +new Date();
    var sixMonths = 15552000;

    if (details.reason === "chrome_update") {
        return;
    } else if (details.reason === "install" || details.reason === "update") {
        return retrieve(allOptions, "local", function (localQuery) {
            retrieve(allOptions, "sync", function (query) {
                console.log("Pulled sync options:", query);

                // canShowWelcome is always the latest sync date.
                var canShowWelcome = (query.lastInstall > 1) && ((current - query.lastInstall) > sixMonths);
                if (localQuery.showWelcome == false || query.showWelcome == false) {
                    canShowWelcome = false;
                }

                var options = {};

                // user previously installed on another machine, either sync or do initial setup
                if (query["syncOptions"]) {
                    console.log("saving sync option setup");
                    allOptions.forEach(function (elem) {
                        options[elem] = query[elem];
                    });

                    options["lastInstall"] = current;
                    save(options, "local");
                } else if(details.reason === "install") {
                    // User hasn't previously installed, save defaults
                    console.log("saving initial setup (not syncing)");
                    saveInitial();
                }

                // be sure to save when we last installed (or updated)
                save({ "lastInstall": +new Date() }, "sync");

                // on initial install, or every 6 months, show Welcome Page
                if (details.reason === "install" || canShowWelcome) {
                    console.log("background.js: showing welcome page");
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
                console.log('background.js: "%s|%s" changed. "%s" -> "%s"',
                    namespace,
                    key,
                    change.oldValue,
                    change.newValue);

                saveObj[key] = change.newValue;
            }
        }
        if(Object.keys(saveObj).length > 0) {
            console.log("Saving sync values locally");
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

        console.log("Saving the following items to " + area + ":", items);
        chrome.storage[area].set(items);
    });
}

function retrieve(items, area, cb) {
    if ("function" !== typeof cb) {
        cb = function (items) {
            console.log("items:", items);
        }
    }

    chrome.storage[area].get(items, cb);
}

init();
