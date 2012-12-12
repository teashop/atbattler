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
			.to({y:effectNum.y+20, x:effectNum.x + _.random(-25,25), scaleX: effectNum.scaleX, scaleY: effectNum.scaleY, alpha:0.2 }, 400, createjs.Ease.circIn)
			.call(function(tween) { stage.removeChild(effectNum); });

	};
}


/**
 * Command Pane Menu Template
 */
var commandMenuTemplate = _.template('<div id="com_<%= id %>" heroId="<%= id %>" class="command-pane" position="<%= position %>"><%= content%></div>');

/** 
 * Carousel for 'command panes' (command list for ready heroes)
 */
function CommandCarousel(container) {
  var defaultPaneTemplate =  _.template('<div id="com_<%= id %>" class="command-pane" position="<%= position %>"><%= content%></div>');
  this.obj = container;
  this.paneWidth = 200;
  this.paneIdPrefix = 'com_';
  this.obj.append('<div class="command-tray" style="display:none"></div>');
  this.tray = $('.command-tray',this.obj);
  this.numPanes = 0;
  this.paneInFocus = null;
}

var CC = CommandCarousel.prototype;

CC.moveRight = function() {
  var dist = 1;
  if(this.numPanes <= 1 || this.tray.is(':animated')) {
    return;
  }
  $('.command-pane',this.obj).slice(-dist).prependTo(this.tray);
  this.paneInFocus = $('.command-pane',this.obj);
  var width = this.paneWidth;
  this.tray.css({left:'-='+(this.paneWidth*dist)+'px'});
  this.tray.stop().animate({left:"+="+this.paneWidth*dist+"px"},200,function(){
    // TODO: other callbacks
  });
}

CC.moveLeft = function() {
  var dist = 1;
  if(this.numPanes <= 1 || this.tray.is(':animated')) {
    return;
  }
  this.tray.stop().animate({left:"-="+(this.paneWidth)*dist+"px"},200,
    (function(){
      $('.command-pane',this.obj).slice(0, dist).appendTo(this.tray);
      this.tray.css({left:'+='+(this.paneWidth)+'px'});
      this.paneInFocus = $('.command-pane',this.obj);
      // TODO: other callbacks
    }).bind(this)
  );
}

CC.add = function(item) {
  var pos = item.position;
  var toAdd = commandMenuTemplate(item);
  var curPane = $('.command-pane', this.obj);
  // protip: current pane in focus in the tray is the 1st element
  var paneInFocusId = curPane.attr('id');
  var successorId = null;
  while (curPane.length > 0) {
    if (curPane.attr('position') > pos) {
      successorId = curPane.attr('id');
      break;
    }
    curPane = curPane.next();
  }
  // couldn't find it  or successor is in focus == add to end.
  // (Successor in focus causes focus to bump)
  if (!successorId || paneInFocusId == successorId) {
    $(toAdd).appendTo('.command-tray');
  } else {
    // found it, insert before closest successor 
    $('#' + successorId).before(toAdd);
  }
  // first pane = show tray
  if (this.numPanes == 0) {
    this.tray.slideToggle(100);
  }
  this.numPanes++;
}

CC.remove = function(id) {
  var targetId = this.paneIdPrefix + id;
  var target = $('#' + targetId);
  if (target.length > 0) {
    target.slideToggle(100, function() {
        target.remove(); 
      });
    this.numPanes--;
    // last pane removed, so hide
    if (this.numPanes == 0) {
      this.tray.slideToggle(100);
    }
  }
}

/** TWEENS **/

function tweenHeroHit(target, reverse, origX) {
	var curPosX = origX ? origX : target.x;
	var dirX = reverse ? -1 : 1;
	var tween = createjs.Tween.get(target, {loop:false})
		.to({x:curPosX-20*dirX, skewX:-5*dirX}, 200, createjs.Ease.bounceOut)
		.to({x:curPosX, skewX:0}, 200, createjs.Ease.bounceIn);
	return tween;
}
