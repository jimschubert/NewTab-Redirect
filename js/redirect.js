/*global chrome,document,window */
(function init() {
    "use strict";
    chrome.storage.local.get(["url","tab.selected"], function (items) {
        var url = items.url;
        if(url) {
            if (/^http[s]?:/i.test(url)) {
                document.location.href = url;
            } else {
                if (/chrome-internal:\/\/newtab[\/]?/.test(url)) { url = "chrome://apps/"; }
                // a keen user may open the extension's background page and set:
                // chrome.storage.local.set({'tab.selected': false});
                var selected = items["tab.selected"] === undefined ? true : (items["tab.selected"] == "true");
                chrome.tabs.getCurrent(function (t) {
                    if (t.url === "chrome://newtab/") {
                        chrome.tabs.update(t.id, {
                            "url": url,
                            "selected": selected
                        });
                    }
                });
            }
        } else {
            angular.resumeBootstrap();
        }
    });
}());
