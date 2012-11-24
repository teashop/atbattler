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
	this.tickSize = 33; // ~30 FPS
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

// REQUIRE: easeljs, tweenjs

/** 
 * Adds one of those cute 'popping' numbers so beloved for showing damage
 * and healing.  Requires an 'anchor' (target DisplayObject) for placement.
 */
var EffectNumberGenerator = function(stage) {
	this.stage = stage;

	this.generate = function(num, isCrit, anchor, type) {
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
					theColor = isCrit ? '#8df' : '#7cf';
					theNum = '+' + num;
					break;
				default:
					break;
			} // switch
		}
		var theFont = isCrit ? 'bold 20px Arial' : '20px Arial';
		var effectNum = new createjs.Text(theNum, theFont, theColor);      
		effectNum.x = anchor.x - anchor.regX + (_.random(-5,5));
		effectNum.y = anchor.y - anchor.regY + (_.random(-10,0));
		effectNum.regY = 0;
		effectNum.textAlign = "center";
//		effectNum.shadow = new createjs.Shadow('#333', -2, 2, 2);

		this.stage.addChild(effectNum);

		// runs the 'pop' and once complete removes the number
		var numTween = createjs.Tween.get(effectNum, {loop:false})
			.to({y:effectNum.y-60, scaleX: effectNum.scaleX*1.5, scaleY: effectNum.scaleY*1.5}, 300)
			.to({y:effectNum.y+20, x:effectNum.x + _.random(-25,25), scaleX: effectNum.scaleX, scaleY: effectNum.scaleY, alpha:0.2 }, 400, createjs.Ease.cubicIn)
			.call(function(tween) { stage.removeChild(effectNum); });

	};
}
