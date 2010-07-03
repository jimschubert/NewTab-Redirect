var doc = document;
var ce = chrome.extension;
var $elem = "getElementById";
var $make = "createElement";
var $bp = "getBackgroundPage";
var $setHide = "setHideText";
var $setUrl = "setUrl";
var $setOld = "setOld";
var _st = "style";
var _cls = "className";
var _val = "value";
var _txt = "innerText";
var _chk = "checked";
var __down, __up;

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}
var chromePages = {
    Extensions: "chrome://extensions/",
    History: "chrome://history/",
    Downloads: "chrome://downloads/",
    NewTab: "chrome-internal://newtab/",
    Bookmarks: "chrome://bookmarks/",
    Internals: "chrome://net-internals"
}
var aboutPages = ["about:blank", "about:version", "about:plugins", "about:cache", "about:memory", "about:histograms", "about:dns", "about:terms", "about:credits", "about:net-internals"];
var popularPages = {
    "Facebook": "www.facebook.com",
    "MySpace": "www.myspace.com",
    "Twitter": "www.twitter.com",
    "Digg": "www.digg.com",
    "Delicious": "www.delicious.com",
    "Slashdot": "www.slashdot.org"
};


// save options to localStorage.
function save_options(){
    var _url = doc[$elem]('custom-url');
    var url = _url[_val];
    if (url == "") {
        url = aboutPages[0];
    }
    
	if(url.startsWith("about:") || url.startsWith("chrome:") || url.startsWith("chrome-internal:")){
		save(true, url);
	} else if (isValidURL(url)) {
        save(true, url);
    } else { save(false, url); }
}

function save(good, url){
	clearTimeout(__up);
	clearTimeout(__down);
    var _sts = doc[$elem]('status');
	var controller = ce[$bp]();
	var _hide = doc[$elem]('hidetext');
	var _old = doc[$elem]('old');
	
    if (good) {
        controller[$setHide](_hide[_chk]);
        controller[$setOld](_old[_chk]);
        controller[$setUrl](url);
        _sts[_txt] = "Options Saved.";
    }
    else {
        _sts[_txt] = ("Invalid Url. Not saved.");
    }
    
    _sts[_st].display = "block";
	_sts[_cls] = "slideDown";
    __up = setTimeout(function(){
		clearTimeout(__down);
		_sts[_cls] = "slideUp";
		__down = setTimeout(function(){_sts[_cls] = ""; _sts[_st].display = "none";}, 2000);
    }, 3050);
}

// Restores select box state to saved value from localStorage.
function restore_options(){	
	var controller = ce[$bp]();
    var url = controller.url || "http://www.facebook.com/";
	doc[$elem]('custom-url')[_val] = url;
    var check = controller.hidetext;
	doc[$elem]('hidetext')[_chk] = check;
    var old = controller.old;
	doc[$elem]('old')[_chk] = old;
}

function isValidURL(url){
    var urlRegxp = /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/;
    if (urlRegxp.test(url) != true) {
        return false;
    }
    else {
        return true;
    }
}

function saveQuickLink(url){
    var uurl = unescape(url);
	doc[$elem]('custom-url')[_val] = uurl;
    save(true, uurl);
    return false;
}

function ready(){	
    restore_options();
	var _chromes = doc[$elem]('chromes');
	var _abouts = doc[$elem]('abouts');
	var _pops = doc[$elem]('popular');

	for (var key in chromePages) {
		var value = chromePages[key];
		var anchor = "<a href=\"javascript:saveQuickLink('" + value + "');\">" + key + "</a>";
		var item = doc[$make]('li');
		item.innerHTML = anchor;
		_chromes.appendChild(item);
	};
	
	for (var i = aboutPages.length - 1; i >= 0; i--){
		var $this = aboutPages[i];
		var anchor = "<a href=\"javascript:saveQuickLink('" + $this + "');\">" + $this + "</a>";
		var item = doc[$make]('li');
		item.innerHTML = anchor;
		_abouts.appendChild(item);
	};
	
	for (var key in popularPages) {
		var value = popularPages[key];
		var anchor = "<a href=\"javascript:saveQuickLink('" + value + "');\">" + key + "</a>";
		var item = doc[$make]('li');
		item.innerHTML = anchor;
		_pops.appendChild(item);
	};
}