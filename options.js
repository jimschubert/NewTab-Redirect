// naming convention: object: name, function: $name, property: _name, event: __name
var doc = document;
var ce = chrome.runtime;
var $elem = "getElementById";
var $make = "createElement";
var $bp = "getBackgroundPage";
var $setUrl = "setUrl";
var $setOld = "setOld";
var _st = "style";
var _cls = "className";
var _val = "value";
var _txt = "innerText";
var _chk = "checked";
var __down, __up;
var $i18n = chrome.i18n.getMessage;

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
    "Google+": "plus.google.com",
    "Facebook": "www.facebook.com",
    "Twitter": "www.twitter.com",
    "Yahoo": "www.yahoo.com",
    "Wikipedia" : "www.wikipedia.org",
    "Digg": "www.digg.com",
    "Delicious": "www.delicious.com",
    "Slashdot": "www.slashdot.org"
};

var empty = [[]];
var langMap = {
    "options_heading": [$i18n("extName")],
    "options_subheading": empty,
    "options_status": empty,
    "options_url_label": empty,
    "options_hide_hint": empty,
    "options_localFiles_hint": empty,
    "options_quickSave_headingLarge": empty,
    "options_quickSave_headingSmall": empty,
    "options_chromePages": empty,
    "options_aboutPages": empty,
    "options_popularPages": empty,
    "options_donate_headingLarge": empty,
    "options_donate_headingSmall": empty,
    "options_anyQuestions": [
        '<a href="https://github.com/jimschubert/newtab-redirect/wiki" target="_blank">wiki</a>'
    ],
    "options_createdBy": empty,
    "options_footerPlea": empty,
    "options_githubTitle": empty,
    "btnSave": empty,
    "btnCancel": empty
};

// save options to localStorage.
function save_options(){
    var _url = doc[$elem]('custom-url');
    var url = _url[_val];
    if (url == "") {
        url = aboutPages[0];
    }

   save(true, url);
}

function save(good, url){

	var background = ce[$bp](function(controller) { 
		clearTimeout(__up);
		clearTimeout(__down);

		var _sts = doc[$elem]('status');
		var _old = doc[$elem]('old');
		var _options = {};
		if (good) {
			_options.url = encodeURI(url);
			_options.old = _old.checked;
			window.localStorage.options = JSON.stringify(_options);
			controller.setUrl(url);
			_sts[_txt] = $i18n("options_status",[[]]);
		} else {
			_sts[_txt] = ("Invalid Url. Not saved.");
		}
	    
	    	_sts[_st].display = "block";
		_sts[_cls] = "slideDown";
		__up = setTimeout(function(){
			clearTimeout(__down);
			_sts[_cls] = "slideUp";
			__down = setTimeout(function(){
				_sts[_cls] = "";
				_sts[_st].display = "none";
			}, 2000);
		}, 3050);
	});
}

function restore_options(){	
   var _options = JSON.parse(window.localStorage.options);
	doc[$elem]('custom-url')[_val] = _options.url;
	doc[$elem]('old').checked = _options.old;
}

function saveQuickLink(url){
    var uurl = unescape(url);
	  doc[$elem]('custom-url')[_val] = uurl;
    save(true, uurl);
    return false;
}

function init(){	
    restore_options();
	var _chromes = doc[$elem]('chromes');
	var _abouts = doc[$elem]('abouts');
	var _pops = doc[$elem]('popular');

	Object.keys(chromePages).forEach(function(key,idx) {
		var value = chromePages[key];
		var anchor = "<a data-target='" + value + "'>" + key + "</a>";
		var item = doc[$make]('li');
		item.innerHTML = anchor;
		_chromes.appendChild(item);
	});
	
	for (var i = aboutPages.length - 1; i >= 0; i--){
		var $this = aboutPages[i];
		var anchor = "<a data-target='" + $this + "'>" + $this + "</a>";
		var item = doc[$make]('li');
		item.innerHTML = anchor;
		_abouts.appendChild(item);
	};
	
	Object.keys(popularPages).forEach(function(key,idx) {
		var value = popularPages[key];
		var anchor = "<a data-target='" + value + "'>" + key + "</a>";
        var item = doc[$make]('li');
		item.innerHTML = anchor;
		_pops.appendChild(item);
	});

    Object.keys(langMap).forEach(function(key,idx) {
        var item = key,
            extras = langMap[key];
        local(item, extras);
    });

    document.body.addEventListener("click", function(e) {
        var target = e.target && e.target.getAttribute("data-target");
        if(target) {
            saveQuickLink(target);
        }
    }, true);
}

function local(elem, supp) {
    var item = doc[$elem](elem);
    if(item) {
        var txt = $i18n(elem, supp);
        // write localized text, otherwise don't update existing text.
        if(txt) {
            item.innerHTML = $i18n(elem, supp);
        } else { console.log(elem + " missing"); }
    }
}

window.addEventListener("DOMContentLoaded", init, true);
