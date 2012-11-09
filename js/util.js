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
		this.prevTime = now;
	}
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
C.start = function(adjustment) {
	this.stopNextTick = false;
	this.timer = setTimeout(this.nextTick.bind(this), adjustment ? this.tickSize - adjustment : this.tickSize);
}
/** END Clock **/


/**
 * A simple representation of an 'event-queue', which fires a 'queued' event
 * when a new event is added.
 */
function EventQueue() {
	this.events = [];
}
var EQ = EventQueue.prototype;
EQ.push = function(theEvent) {
	this.events.push(theEvent);
	$(this).trigger('queued');
}
EQ.shift = function() {
	return this.events.shift();
}
EQ.clear = function() {
	this.events = [];
}
/** END Event Queue */

