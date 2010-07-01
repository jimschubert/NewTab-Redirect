String.prototype.startsWith = function(str) {
	return (this.indexOf(str)===0);
}
var chromePages = {
	Extensions : "chrome://extensions/",
	History : "chrome://history/",
	Downloads : "chrome://downloads/",
	NewTab : "chrome-internal://newtab/",
  Bookmarks : "chrome://bookmarks/",
  Internals : "chrome://net-internals"
}
var aboutPages = ["about:blank","about:version", "about:plugins","about:cache", "about:memory","about:histograms","about:dns", "about:terms", "about:credits", "about:net-internals"];
var popularPages = { 
	"Facebook":"www.facebook.com",
	"MySpace":"www.myspace.com",
	"Twitter":"www.twitter.com",
	"Digg":"www.digg.com",
	"Delicious":"www.delicious.com",
	"Slashdot":"www.slashdot.org"
};

	
// save options to localStorage.
function save_options() {
	var url = $('#custom-url').val();
	if(url == ""){
		url = aboutPages[0];
	}
	
	if( $.inArray(String(url), aboutPages) || isValidURL(url)) {
		save(true,url);
	} else {
		save(false,url);
	}		
}

function save(good,url) {
	if(good) {
		chrome.extension.getBackgroundPage().setHideText($('#hidetext').is(':checked'));
		chrome.extension.getBackgroundPage().setOld($('#old').is(':checked'));
		chrome.extension.getBackgroundPage().setUrl(url);
		$('#status').text("Options Saved.");
	} else {
		$('#status').text( url + " is invalid. Try again (http:// is required)");	
	}
	
	$('#status').css("display", "block");
	setTimeout(function(){
		$('#status').slideUp("fast").css("display", "none");
	}, 1050);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var url = chrome.extension.getBackgroundPage().url || "http://www.facebook.com/";	
	 $('#custom-url').val(url);
	 var check = chrome.extension.getBackgroundPage().hidetext;
	 $('#hidetext').attr('checked', check);
}

function isValidURL(url) {
	var urlRegxp = /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/;
	if (urlRegxp.test(url) != true) {
		return false;
	} else {
		return true;
	}
}

function saveQuickLink(url){
	var uurl = unescape(url);
	 $('#custom-url').val(uurl);
	 save(true,uurl);
	 return false;
}

$(document).ready(function(){
	restore_options();
	$.each(chromePages, function(k,v) {
		var anchor = "<a href=\"javascript:saveQuickLink('"+v+"');\">"+k+"</a>";
		$('#chromes').append("<li>" + anchor + "</li>");
	});
	$.each(aboutPages, function() {
		if(this.startsWith("about:")) { /* quick fix to handle chrome pages elsewhere */
			var anchor = "<a href=\"javascript:saveQuickLink('"+this+"');\">"+this+"</a>";
			$('#abouts').append("<li>" + anchor + "</li>");
		}
	});
	$.each(popularPages, function(k,v) {
		var anchor = "<a href=\"javascript:saveQuickLink('"+v+"');\">"+k+"</a>";
		$('#popular').append("<li>" + anchor + "</li>");
	});
});
