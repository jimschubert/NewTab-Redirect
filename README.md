# NewTab Redirect!

[![Join the chat at https://gitter.im/jimschubert/NewTab-Redirect](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jimschubert/NewTab-Redirect?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Donate](http://pledgie.com/campaigns/15715.png)](http://pledgie.com/campaigns/15715)  

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=jimschubert&url=https://github.com/jimschubert/NewTab-Redirect&title=New%20Tab%20Redirect!&language=&tags=github&category=software)

## Google Chrome Extension
_disclaimer: Google and Google Chrome are trademarks of Google, Inc. [NewTab Redirect! is an extension for Google Chrome](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna?hl=en)_

Sets a custom URL to load in new tabs.  Choose from:
 *  Chrome's about pages
 *  NewTab
 *  Extensions
 *  Downloads
 *  History
 *  Popular URLs
 *  Your own URL
 
Your custom tab can also be a local file, allowing you to create your own new tab page. Saving blank text will cause your new tab to be about:blank.

Files can begin with: `file:\\`, `file://`, and `file:///`

**Important:** 
This is not meant to replace your homepage, only new tabs.  If your browser is set to load the New Tab page as your homepage, there may be odd consequences.


## Omnibar support

If you use the built-in New Tab Redirect Apps page, you will be able to type directly into the omnibar. If you use a custom url, the architecture of the extension can not allow for focusing or clearing of the omnibar.

Google Chrome extensions do not currently have access to interact with the omnibar for highlighting after the new page is created.  There is an experimental API to retrieve values and detect user input in the omnibar, but it does not allow extensions to highlight the text.  I've tested version 1.0.1 of New Tab Redirect! across numerous developer builds, and the cursor only occasionally ends at the end of the omnibar.  However, this is handled by Chrome itself and can not be modified via the extension.  As soon as Chrome offers this functionality, I will implement it.  Until then, it is possible to use `CTRL+L` to quickly highlight the omnibar.

## "Can I purchase your extension?"

**Absolutely not.**

I get emails asking this question at least once a week. This extension is not now, nor will it ever be, for sale. I've turned down offers between $100 and $50,000: I'm obviously not kidding about this so please don't continuously pester me and waste my free time.

First of all, this extension is released under the MIT license. You are basically free to release this extension under a different name and of course provide attribution to me in some way. This extension will **always** be 100% free and open source in this way. You'll be starting your user base at 0, that's just how it works.

Secondly, the only reason people have asked to purchase this extension is because it has nearly a million regular users. Many developers are looking for some quick cash and attempt to purchase very popular extensions so they can secretly add anonymous data gathering, injected ads, or some other third-party code.  I don't like that crap in extensions I use, why would I want it in an extension I've created? I respect my users far too much to allow for this kind of shady business to happen to my extension. Again, I'm not joking. I've discovered an extension I loved silently sending every visited page to a third-part marketing firm. I immediately reported that extension to Google and it was removed from the web store *within two hours*. 

I don't need supplemental income, so don't ask to purchase the extension or try to get me to include your code with my code. If you want to contribute, that's fine, but I will *absolutely never* include code that sends or receives data anywhere other than syncing with the user's Google Account.

Lastly, the only way to sell you my extension with all those coveted users would be to relinquish the rights to my Google Account (james.schubert@gmail.com). This account is about 90% of my online identity, so that will obviously never happen. I realize it's possible to jump through hoops with Google to transfer ownership, but that's not something I'm willing to do. Sorry, it's as simple as that. If I'm wrong and transferring ownership also transfers users, I frankly don't care.

To summarize: **the extension is not for sale**

## No affiliation with Google!

_I am not affiliated with Google or Google Chrome.  
Google Chrome is a registered trademark of Google, Inc._

If I have some free time, I don't mind answering questions related to other issues you're having with Google Chrome (outside of the New Tab Redirect extension). I don't have a lot of free time, though.

## Legal

NewTab Redirect is released under the [MIT license](http://bit.ly/mit-license). NewTab Redirect was previously hosted on [Google Projects](http://code.google.com/p/newtabredirect/) under [GPLv3 license](http://www.gnu.org/licenses/gpl.html). You *may not* redistribute this software without proper attribution.

* AngularJS: Code is MIT Licensed. Details are available [here](https://github.com/angular/angular.js/blob/master/LICENSE)

* jQuery: Code is MIT Licensed. Details are available [here](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)

* Font Awesome by Dave Gandy - http://fontawesome.io: Code is MIT licensed, Fonts are SIL OFL 1.1. Details are available [here](http://fontawesome.io/license/)

* The new tab and document-new icons were released by <em>tango!</em> into the public domain.  Details are available [here](http://en.wikipedia.org/wiki/File:Tab-new.svg)
