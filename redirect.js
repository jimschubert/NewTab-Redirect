var ce = chrome.runtime;
var $bp = "getBackgroundPage";
var $msg = chrome.i18n.getMessage;
function init(){ 
	var _opts =  JSON.parse(window.localStorage.options);	
	var url = _opts.url || "";
	if ((/^http:/i.test(url)) || /^https:/i.test(url)) {
		document.location.href = url;
		return;
	} 
	
    var ctrl = ce[$bp](function(c) {
        chrome.tabs.getCurrent(function(t) { c.r(t.id); });
    });
}

document.onload = init();
