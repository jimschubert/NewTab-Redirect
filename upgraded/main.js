/*global chrome*/
function init(){
    'use strict';
    var remove = document.getElementById('btnremove');
    var done = document.getElementById('permissionsdone');

    remove.addEventListener('click', function(){
        var optional = chrome.runtime.getManifest().optional_permissions;
        console.log('Removing optional permissions:', optional);
        chrome.permissions.remove({
            permissions: optional
        }, function(result){
            console.log('chrome.permissions.remove successful:', result);
            done.className = 'show';
            remove.className = 'hide';
        });
    });
}

window.addEventListener('DOMContentLoaded', init, true);