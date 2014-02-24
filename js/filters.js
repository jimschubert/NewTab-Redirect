'use strict';
var filters = angular.module('newTab.filters', []);

filters.filter('iconsize', function(){
    return function(input, size){
        size = 0+size || 200;
        if(angular.isArray(input)){
            var found,
                current,
                len = input.length,
                i = 0;

            for(i;!found || i<len;i++){
                current = input[i];
                if(current.size >= size){
                    found = current;
                }
            }
            return (found||{}).url;
        } else {
            return input;
        }
    };
});
