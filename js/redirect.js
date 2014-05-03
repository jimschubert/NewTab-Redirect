/*global chrome,document,window */
(function init() {
    "use strict";
    chrome.storage.local.get(["url","tab.selected", "always-tab-update"], function (items) {
        var url = items.url;
        if(url) {
            if (/^http[s]?:/i.test(url) && items["always-tab-update"] !== true) {
                document.location.href = url;
            } else {
                // a keen user may open the extension's background page and set:
                // chrome.storage.local.set({'tab.selected': false});
                var selected = items["tab.selected"] === undefined ? true : (items["tab.selected"] == "true");
                chrome.tabs.update({
                    "url"     : url,
                    "highlighted": selected
                });
            }
        } else {
            angular.resumeBootstrap();
        }
    });
}());
