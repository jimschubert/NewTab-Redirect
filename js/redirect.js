/*global chrome,document,window */
(function init() {
    "use strict";
    chrome.storage.local.get(["url","tab.highlighted"], function (items) {
        var url = items.url;
        if(url) {
            // a keen user may open the extension's background page and set:
            // chrome.storage.local.set({'tab.selected': false});
            var highlighted = items["tab.highlighted"] === undefined ? true : (items["tab.highlighted"] == "true");
            chrome.tabs.update({
                "url": url,
                "highlighted": highlighted,
            });
        } else {
            angular.resumeBootstrap();
        }
    });
}());
