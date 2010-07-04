var ce = chrome.extension;
var $bp = "getBackgroundPage";
function h(){	
	var _opts =  JSON.parse(window.localStorage.options);	
    if (!_opts.hidetext) {
        document.getElementsByTagName('body')[0].innerHTML = 'Redirecting...<br><em>If your page doesn\'t load within 5 seconds,<a href=\'javascript:r()\'>click here<\/a><\/em>';
    }
}

function r(){   
	var _opts =  JSON.parse(window.localStorage.options);	
	var url = _opts.url || "";
	if ((/^http:/i.test(url)) || /^https:/i.test(url)) {
		document.location.href = url;
		return;
	}
	ce.sendRequest({  redirect: true  }, function(rsp){ });
}