var ce = chrome.extension;
var $bp = "getBackgroundPage";
var $msg = chrome.i18n.getMessage;
var text;
var help, click;

function h(){
    console.log("begin h()");

    text = $msg("redirectText") || "Redirecting...";
    document.title = text;
	var _opts =  JSON.parse(window.localStorage.options);	
    if (!_opts.hidetext) {
        help = $msg("redirectMsg") || "If your page does not redirect in 5 seconds:";
        click = $msg("clickHere") || "click here";
        document.getElementsByTagName('body')[0].innerHTML = 
            (text + '<br><em>' + help + '<a href=\'javascript:r()\'>' + click + '<\/a><\/em>');
    }

    console.log("end h()");
}

function r(){ 
    console.log("begin r()");

	var _opts =  JSON.parse(window.localStorage.options);	
	var url = _opts.url || "";
	if ((/^http:/i.test(url)) || /^https:/i.test(url)) {
		document.location.href = url;
		return;
	} 
	
    var ctrl = ce[$bp]();
    console.log(ctrl);

    if(ctrl) {
        chrome.tabs.getCurrent(function(t) { ctrl.r(t.id); });
    } else { r(); }

    console.log("end r()");
}

function init() { h(); r(); }

document.onload = init();
