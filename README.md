Morgan
======

Your personal assistant
-----------------------

Get it running
==============

* First you will need to create a `dropbox.key` file in the root directory,
  which should contain a Dropbox application key (**NOT** the application secret!!).

* You can get the key from [Dropbox's developer site](https://www.dropbox.com/developers).
  If you don't feel like getting one right now, you can simply rename `dropbox.key.example` to `dropbox.key`.
  The only restriction is that you will need to run the application on either one of the two whitelisted domains: `localhost` or `localhost:8000`.

* Or you can create an application on the Dropbox's developer site, get the key,
  and add in your own whitelist of domains.
