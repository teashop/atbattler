// TODO: better less confusing name.
// used to track a duration-based triggered effect
//    length - total length of the event
//    interval - defines how often effects of this event 'fire' or update. Can be a number, array of predefined ticks, or a function of the form function(totalElapsed, sinceLastInterval){ ... } that returns 'true' if the event should fire given the total elapsed time and time since last interval.
//
exports.DurationEvent = function(length, interval, onFire, onComplete) {
  this.length = length;
  this.elapsed = 0;
  this.sinceLastInterval = 0;
  // if an interval is not specified, fire once after the complete duration
  this.interval = interval || length;
  this.isNextInterval = null;
  this.onFire = onFire;
  
  // TODO, maybe callback this shit as well.
  var that = this;
  if (this.interval instanceof Array) {   
    // rely on supplied array for times where the event should fire.
    this.isNextInterval = function() {
      if (that.interval.length > 0 && that.elapsed >= that.interval[0]) {
        that.interval.shift();
        return true;
      }
      return false;
    };
  } else if (interval instanceof Function) {
    // rely on supplied f'n.  Best used for non-linear calculable intervals.
    this.isNextInterval = function() {
      return interval.apply(that, [that.elapsedTime, that.sinceLastInterval]);
    };
  } else {
    // returns true every time the interval elapses. Simple linear progression.
    this.isNextInterval = function() {      
      return (that.sinceLastInterval >= that.interval);
    };
  }
}
var DE = exports.DurationEvent.prototype;
// updates time elpased.  Returns true iff complete
DE.updateElapsed = function(length) {
  // prevent extraneous calls to a completed event
  if (this.elapsed >= this.length) {
    return true;
  }
  this.elapsed += length;
  this.sinceLastInterval += length;
  var isComplete = this.elapsed >= this.length; 

  // args for calls. TODO: not sure why need to dereference to local var.
  var argElapsed = this.elapsed;
  var argSinceLast = this.sinceLastInterval;
  
  if (this.isNextInterval.call(this, argElapsed, argSinceLast)) {
    // TODO: execute whatever it is that's supposed to be 
  this.onFire(argElapsed, argSinceLast);
    this.sinceLastInterval = 0;
  }
  if (isComplete) {
    // TODO: execute special finishing thing.
  }
  return isComplete;
}
