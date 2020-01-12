/*global chrome,document,window */
(function init(angular) {
    "use strict";
    try {
        chrome.storage.local.get(["url", "tab.selected", "redirectMechanism", /*deprecated*/"always-tab-update"], function (items) {
            var url = items.url;
            if (url) {
                url = (0 !== url.indexOf("about:") && 0 !== url.indexOf("data:") && -1 === url.indexOf("://")) ? ("http://" + url) : url;
                switch (items.redirectMechanism || (items["always-tab-update"] ? 'update' : 'redirect')) {
                    case 'redirect':
                        document.location.href = url;
                        break;
                    case 'update':
                        chrome.tabs.getCurrent(function (tab) {
                            // a keen user may open the extension's background page and set:
                            // chrome.storage.local.set({'tab.selected': false});
                            var selected = items["tab.selected"] === undefined ? true : (items["tab.selected"] == "true");
                            chrome.tabs.update(tab.id, {
                                "url": url,
                                "highlighted": selected
                            });
                        });
                        break;
                    case 'iframe':
                        var iframe = document.createElement('iframe');
                        iframe.src = url;
                        document.body.style.overflow = 'hidden';
                        document.body.appendChild(iframe);
                        break;
                }
            } else {
                angular.resumeBootstrap();
            }
        });
    } catch(e){
        // If anything goes wrong with the redirection logic, fail to custom apps page.
        console.error(e);
        angular.resumeBootstrap();
    }
})(angular);
