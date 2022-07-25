At some point Google decided to migrate some of their apps from the chrome webstore to their new G-Suite.

This meant that the "default" Google and YouTube apps were no longer getting returned by the API.

As of the current time of writing this the only non-code-change workaround for this problem is to disable the following chrome flags:

``#enable-migrate-default-chrome-app-to-web-apps-gsuite``

``#enable-migrate-default-chrome-app-to-web-apps-non-gsuite``

Going under the assumption that Google will eventually remove these flags I have made the following workaround:

1. Copied the API responses for all the 6 now missing Apps, and put them in the ``migrated_apps`` directory.

2. Downloaded the icons for all 6 Apps and put them in the ``images/migrated_app_icons`` directory.

3. Modified the icon url with a regex substring that will be replaced with extension id.

4. Concatenated the app list in loadApps with the migrated apps


Pros of this workaround:

1. It Works.

Cons of this workaround:

1. It involves keeping snapshots of these App API responses
2. Some features like "Uninstall" will be rendered useless on these specific migrated apps