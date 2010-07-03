var wid, tid;
var ce = chrome.extension;
var $bp = "getBackgroundPage";
var old = ce[$bp]().old;
var hide = ce[$bp]().hidetext;
function h(){
    if (!hide) {
        document.getElementsByTagName('body')[0].innerHTML = 'Redirecting...<br><em>If your page doesn\'t load within 5 seconds,<a href=\'javascript:r()\'>click here<\/a><\/em>';
    }
}

function r(){
    if (old) {
        var url = ce[$bp]().url || "";
        if (/^http/i.test(url)) {
            document.location.href = url;
            return;
        }
        else {
            chrome.windows.getCurrent(function(w){
                wid = w.id;
                chrome.tabs.getSelected(wid, function(t){
                    tid = t.id;
                });
            });
            ce[$bp]().r(tid);
        }
    }
    else {
        ce.sendRequest({
            redirect: true
        }, function(rsp){
        });
    }
}
