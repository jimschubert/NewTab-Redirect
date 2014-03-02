/*global chrome,document,window */
(function init() {
    "use strict";
    chrome.storage.local.get("url", function (items) {
        var url = items.url;
        if(url) {
            if (/^http[s]?:/i.test(url)) {
                document.location.href = url;
            } else {
                if (/chrome-internal:\/\/newtab[\/]?/.test(url)) { url = "chrome://apps/"; }
                chrome.tabs.getCurrent(function (t) {
                    if (t.url === "chrome://newtab/") {
                        chrome.tabs.update(t.id, {
                            "url": url,
                            "selected": true
                        });
                    }
                });
            }
        } else {
            angular.resumeBootstrap();
        }
    });
}());
