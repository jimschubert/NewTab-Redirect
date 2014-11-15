(function(window){
    'use strict';

    // Setting the window.name property in this way allows us to call app.run(), but block until it's ready to be resumed.
    // the resume happens in redirect.js if no redirected new tab url has been specified.
    window.name = 'NG_DEFER_BOOTSTRAP!';
})(window);
