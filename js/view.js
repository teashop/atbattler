/*
   A class to implement a gradually incrementing/decrementing numeric
   value.  JavaScript timeouts are used to periodically change a tracked value;
   these in turn can be reflected to the view via a specified callback.

   This class supports chaining increments - by modifying the target value, 
   the class will reconfigure itself based on its current progress and the new
   target.

   Each call to setTarget() can be supplied with a duration - this will
   RESET the total time remaining to the specified duration. If no duration is
   specified, the total time remaining will reset to the original duration.
   
   This is expressed via a recalculation of the step size:

   newStep = (newTarget-current)/duration*tickSize
*/
var GradualIncrementer = function(theTarget, theCurrent, onUpdate, duration) {
	this.target = theTarget;
	this.current = (+theCurrent);
	this.duration = duration;
	this.onUpdate = (onUpdate instanceof Function) ? onUpdate : function(){};
	this.tickSize = 50; // ~20 FPS
	this.timeout = null;
	this.step = this.calculateStep();
}
var GR_INC = GradualIncrementer.prototype;
GR_INC.getTarget = function() {
	return this.target;
}
GR_INC.setTarget = function(newTarget, newDuration) {
	this.target = newTarget;
	if (newDuration) {
		this.duration = newDuration;
	}
	this.step = this.calculateStep();
	this.start();
}
GR_INC.calculateStep = function() {
	if (this.duration <= 0) {
		// duration shouldn't ever be <= 0; if so treat as a 1 step Op
		return this.target - this.current;
	} else {
		// err on the side of larger steps.
		return Math.ceil((this.target - this.current)/(this.duration * this.tickSize));
	}
}
GR_INC.stepThrough = function() {
	this.current = this.current + this.step;
	var isStepPositive = this.step > 0;
	if ((this.current >= this.target && isStepPositive)
			|| this.current <= this.target && !isStepPositive) {
		this.onUpdate(this.target);
		clearTimeout(this.timeout);
		this.timeout = null;
		return;
	}
	this.onUpdate(this.current, isStepPositive);
	this.timeout = setTimeout(this.stepThrough.bind(this), this.tickSize);
}
GR_INC.start = function() {
	// if there's no currently running timer, start a new one
	if (!this.timeout) {
		this.timeout = setTimeout(this.stepThrough.bind(this), this.tickSize);
	}
}
GR_INC.complete = function() {
	if (this.timeout) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
	this.current = this.target;
	this.onUpdate(this.target);
}

// REQUIRE: easeljs

/** 
 * Adds one of those cute 'popping' numbers so beloved for showing damage
 * and healing.  Requires an 'anchor' (target DisplayObject) for placement.
 */
function addEffectNumber(num, isCrit, anchor, type) {
	var theNum = num;
	var isHeal = type && type == 'heal';
	var theColor = isCrit ? '#ff3' : '#fff';	  
	if (type) {
		switch(type) {
			case 'heal':
				theColor = isCrit ? '#3f7' : '#2e6';
				theNum = '+' + num;
				break;
			case 'heal_sp':
				theColor = isCrit ? '#8ef' : '#7de';
				theNum = '+' + num;
				break;
			default:
				break;
		} // switch
	}
	var theFont = 'bold 20px Arial';
	var numLabel = new createjs.Text(theNum, theFont, theColor);      
	numLabel.x = anchor.x - anchor.regX + (_.random(-5,5));
	numLabel.y = anchor.y - anchor.regY + (_.random(-5,5));
	if (isCrit) {
		numLabel.scaleY = numLabel.scaleX = 1.5;
	}
	numLabel.textAlign = "center";
	numLabel.yRemove = numLabel.y+20;
	numLabel.vA = -0.015;
	numLabel.vX = 0 + (_.random(-1,1)*0.25);
	numLabel.vX = 0;
	numLabel.vY = -8 + (_.random(-1,1)*0.5);
	numLabel.shadow = new createjs.Shadow('#333', -2, 2, 2);
	return numLabel;
}
/**
 * Updates the provided popping effect numbers.
 */
function updateEffectNumbers(effectNumberContainer) {
	var f = 60/effectNumberContainer.fps;
	var l = effectNumberContainer.getNumChildren();
	for (var i=l-1; i>=0; i--) {
		var numLabel = effectNumberContainer.getChildAt(i);
		if (numLabel.vY > 0) {
			numLabel.alpha += numLabel.vA * f; // start fading after apex
		}		
		numLabel.y += numLabel.vY * f;
		numLabel.vY += 0.6 * f;
		numLabel.x += numLabel.vX * f;
		numLabel.scaleX += 0.015 * f;
		numLabel.scaleY += 0.015 * f;
		//remove number that is invisble or past its removal boundary
		if (numLabel.alpha <= 0 || numLabel.y > numLabel.yRemove) {
			effectNumberContainer.removeChildAt(i);		  
		}
	}
}
