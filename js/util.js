/**
 * A simple, event-firing clock with a configurable tick size.
 * The Clock uses JavaScript setTimeout with self-adjustment to ensure that the
 * ticks are not skewed by variance in tge timer.
 */
function Clock(tickSize) {
	this.tickSize = tickSize;
	this.prevTime = (new Date()).getTime();
	this.timer = null;
	// prevents additional ticks after stop() is called
	this.stopNextTick = false;
}

var C = Clock.prototype;
C.getAdjustment = function(now) {
	var adjustment = 0;
	if (now >= this.prevTime + this.tickSize) {
		adjustment = now - this.prevTime - this.tickSize;
	}
  this.prevTime = now;
	return adjustment;
}
C.nextTick = function() {
	var adjustment = this.getAdjustment((new Date()).getTime());
	// TODO: convert to Node event emit
	if (!this.stopNextTick) {
		$(this).trigger('tick');
		// start next tick
		this.start(adjustment);
	} else {
		console.log('clock stopped, swallowing tick.');
	}
}
C.stop = function() {
	this.stopNextTick = true;
	clearTimeout(this.timer);
}
C.pause = function() {
  this.stop();
  // determine how much of time is left before the next tick.
  // this will be used to adjust the clock on a call to resume().
  this.pauseAdjustment = (new Date()).getTime() - this.prevTime;
  while (this.pauseAdjustment > this.tickSize) {
    this.pauseAdjustment -= this.tickSize;
  }
}
C.resume = function() {
  this.start(this.pauseAdjustment ? this.pauseAdjustment : 0);
}
C.start = function(adjustment) {
	this.stopNextTick = false;
	this.timer = setTimeout(this.nextTick.bind(this), adjustment ? this.tickSize - adjustment : this.tickSize);
}
/** END Clock **/


/**
 * A simple representation of an 'event-queue', which calls a provided callback 
 * each time an event is added.  Note that the user must manually call shift() 
 * to retrieve an event.
 */
function EventQueue(callback) {
	this.events = [];
  this.buf = [];
	this.callback = callback;
}
var EQ = EventQueue.prototype;
EQ.push = function(theEvent) {
	this.events.push(theEvent);
	this.callback(1);
}
EQ.length = function() {
  return this.events.length;
}
EQ.shift = function(num) {
  if (!num) {
  	return this.events.shift();
  } else {
    var removed = _.first(this.events, num);
    this.events = _.rest(this.events, removed.length);
    return removed;
  }
}
EQ.clear = function() {
	this.events = [];
  this.buf = [];
}
EQ.bufferLength = function(events) {
  return this.buf.length;
}
EQ.buffer = function(events) {
  this.buf.push.apply(this.buf, arguments);
}
// copies contents of the event queue to the buffer
EQ.stash = function() {
  this.buf.push.apply(this.buf, this.events);
  this.events = [];
}
EQ.flush = function() {
  // add all of the buffered events to the queue, then callback with the 
  // number of added events.
  this.events.push.apply(this.events, this.buf);
  var numBuffered = this.buf.length;
  this.buf = [];
  this.callback(numBuffered);
}
/** END Event Queue */

