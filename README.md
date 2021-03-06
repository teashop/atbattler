# ATBattler

An implementation of a mid-late 1990's "Active-Time Battle" engine, built with HTML5 Canvas and much Javascript.

Currently, ATBattler can function as either a Node.js server/client app or as a pure-in-browser implementation with an emulated server. 

In the pure browser case, the server operates within the browser, but the communication protocol between server and client is simulated by direct reads/writes to local message queues (arrays).

## Instructions

Included implementation is for Node server/client only. Requires Node.js v0.8.9 or later.

1. Run `npm install` to install node dependencies.
1. Start server: `node server.js`
1. Open `client.html` in a browser and click the 'start game' button.

The game can be played with either mouse (click the menus) or keyboard (arrow keys to navigate, enter/space to select).

Note that once the game is over, you will need to restart the server and refresh the client page to play again.


## Browser Support

ATBattler runs on any relatively up-to-date version of Chrome or Firefox.  It also runs in IE9+ (Console must be enabled for now).  It has not been tested in Opera or Safari.

## Features

A quick rundown on the implemented features in ATBattler:

* Gameplay
	* Player readiness gauge; ready status
	* Player death status
	* HP and SP
	* Command input - Fight, Defend (skip turn), Skill, and Item
	* Spells/Skills (currently as randomly-assigned commands)
	* Items with rudiementary inventory (no quantity tracking)
	* Stupid AI (randomly attacks non-dead players)
	* Game over condition
* Client-server gameplay via Websockets.
	* Server hosts game instance and AI client instance
	* Client connects to Server to start game
	* Game Pause/Resume

----

### Node Dependencies


* async 0.1.22
* connect 2.7.2
* sockjs 0.3.5
* underscore 1.4.3
* stitch 0.3.3 for generating client-side JS dist

## Browser Libraries

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

*   John Resig's jQuery Hotkeys Plugin

*   SockJS 0.3.5
