# NewTab Redirect!

<a href='http://www.pledgie.com/campaigns/15715'><img alt='Click here to lend your support to: New Tab Redirect! and make a donation at www.pledgie.com !' src='http://www.pledgie.com/campaigns/15715.png?skin_name=chrome' border='0' /></a>

## Google Chrome Extension
_disclaimer: Google and Google Chrome are trademarks of Google, Inc. NewTab Redirect! is an extension for Google Chrome_

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
Google Chrome extensions do not currently have access to interact with the omnibar for highlighting after the new page is created.  There is an experimental API to retrieve values and detect user input in the omnibar, but it does not allow extensions to highlight the text.  I've tested version 1.0.1 of New Tab Redirect! across numerous developer builds, and the cursor only occasionally ends at the end of the omnibar.  However, this is handled by Chrome itself and can not be modified via the extension.  As soon as Chrome offers this functionality, I will implement it.  Until then, it is possible to use `CTRL+L` to quickly highlight the omnibar.

_I am not affiliated with Google or Google Chrome.
Google Chrome is a registered trademark of Google, Inc._


