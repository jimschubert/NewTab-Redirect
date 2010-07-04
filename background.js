String.prototype.startsWith = function (str) {
    return (this.indexOf(str) === 0);
}
var _options = {};

var url = null;
var protocol = undefined;
var allowedProtocols = ["http://", "https://", "about:", "file://", "file:\\", "file:///", "chrome://", "chrome-internal://"];

function setUrl(url) {
    if (protocolPasses(url) && url.length > 8) {
        this.url = url;
    } else {
        protocol = 'http://';
        var right = url.split('://')
        if (right != undefined && right != null && right.length > 1) {
            this.url = protocol + right[1];
        } else {
            this.url = protocol + url;
        }
    }
	_options = JSON.parse(window.localStorage.options); /* reload */
	_options.url = this.url; /* change */
	window.localStorage.options = JSON.stringify(_options); /* save */

    function protocolPasses(url) {
        if (typeof(url) == 'undefined' || url == null) {
            return false;
        }
        if (url.startsWith(allowedProtocols[3]) && !url.startsWith(allowedProtocols[5])) {
            url.replace(allowedProtocols[3], allowedProtocols[5]);
        } else if (url.startsWith(allowedProtocols[4])) {
            url.replace(allowedProtocols[4], allowedProtocols[5]);
        }
        for (var p in allowedProtocols) {
            if (url.startsWith(allowedProtocols[p])) {
                return true;
            }
        }
        return false;
    }
}

function init() {
   var arr = window.localStorage.options;
   if(arr) { _options = JSON.parse(arr); }
   _options.url =_options.url || localStorage["url"] || "http://www.facebook.com";
	_options.hidetext = _options.hidetext != null ? _options.hidetext :  (localStorage["hidetext"] || true);
	_options.old =_options.old != null ? _options.old :  (localStorage["old"] || false );
   window.localStorage.options = JSON.stringify(_options);
}

function r(tabId) {
    chrome.tabs.update(tabId, {
        "url": this._options.url
    });
}
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ? "redirect called from:" + sender.tab.url : "redirect called anonymously?");
    if (request.redirect) {
            chrome.windows.getCurrent(function(w){
                chrome.tabs.getSelected(w.id, function(t){
					r(t.id);
                });
            });
    }
    sendResponse({
        redirected: this.url
    });
});