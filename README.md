# ATBattler

An implementation of a mid-late 1990's "Active-Time Battle" engine, built with HTML5 Canvas and much Javascript.

## Instructions

Currently, ATBattler is a pure-in-browser implementation with an emulated server.  The server does operate separately from the client, but the communication protocol between server and client is just reads/writes to local 'message queues' (arrays).

To run, just open client.html in a browser and click the 'start game' button.

The game can be played with either mouse (click the menus) or keyboard (arrow keys to navigate, enter/space to select).

## Browser Support

ATBattler runs on any relatively up-to-date version of Chrome or Firefox.  It also runs in IE9+ (Console must be enabled for now).  It has not been tested in Opera or Safari.

----

## Libraries

*	jQuery 1.8.2

	http://www.jquery.org/

* 	EaselJS 0.5.0
* 	TweenJS 0.3.0
* 	PreloadJS 0.2.0

	http://www.createjs.com/

* 	Underscore 1.4.2

	http://underscorejs.org/

* 	Jake Gordon's javascript-state-machine

	https://github.com/jakesgordon/javascript-state-machine

* 	Caolan McMahon's Async Utils

	https://github.com/caolan/async
