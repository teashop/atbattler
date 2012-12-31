var atb = atb || {};

// REQUIRES: easeljs, tweenjs

// Used for Animations and Sprite Sheets.

/**
 * @constant Base hero sprite scale factor.
 */
atb.HERO_BASE_SCALE = 3;


// The easeljs stage. MUST be set otherwise none of the animations will work.
atb.stage = {};

// path to image assets; defaults to './img/'
atb.imagePath = 'img/';

/**
 * @namespace Collection of sprite sheets.
 */
atb.sheet = {};

atb.sheet.BATTLE_ANIM_FRAME_HEIGHT = 96;
atb.sheet.BATTLE_ANIM_FRAME_WIDTH = 96;
atb.sheet.BATTLE_ANIM_REG_X = 48;
atb.sheet.BATTLE_ANIM_REG_Y = 48;

atb.sheet.HERO_FRAME_HEIGHT = 32;
atb.sheet.HERO_FRAME_WIDTH = 24;
atb.sheet.HERO_REG_X = 12;
atb.sheet.HERO_REG_Y = 16;
atb.sheet.HERO_FRAMES_PER_HERO = 12;
atb.sheet.HERO_FRAMES_PER_SHEET = 96; 
atb.sheet.HERO_SLOTS = 8; // i.e. 8 heroes per sheet
atb.sheet.HERO_ROW_SPAN = 4;
atb.sheet.HERO_COL_SPAN = 3;

// ******* BATTLE ANIMATIONS ********

/**
 * Spritesheet - Hit animations
 */
atb.sheet.hit = new createjs.SpriteSheet({
    animations: {
        'strike': [0,3, 'strike', 2],
        'slowStrike': [0,3, 'slowStrike', 5],
      },
    images: [atb.imagePath + 'attack.png'],
    frames: {
        height: atb.sheet.BATTLE_ANIM_FRAME_HEIGHT,
        width: atb.sheet.BATTLE_ANIM_FRAME_WIDTH,
        regX: atb.sheet.BATTLE_ANIM_REG_X,
        regY: atb.sheet.BATTLE_ANIM_REG_Y,
        count: 15
      }
  });

// ******* HEROES ********

/**
 * Under the assumption that there are 8 hero 'slots' per sheet, and that
 * a hero takes up a 3 x 4 block of frames.
 */
atb.sheet.createHeroSheet = function(imageFile, index) {
  // rows: 0, 4
  var rowOffset = (index < atb.sheet.HERO_SLOTS/2) ? 0 : atb.sheet.HERO_ROW_SPAN;

  // columns: 0, 3, 6, 9
  var colOffset = (index % 4) * 3;

  // intermediate row designations: FIXME: this is ugly
  // keeps track of the 'start' frame of each hero-centric row.
  var rows = [];
  _.times(atb.sheet.HERO_ROW_SPAN, function(index) {
      rows.push((rowOffset+index)*12+colOffset);
    });

  var theSheet = new createjs.SpriteSheet({
    animations: {
      // 2nd row, 2nd column of hero block
      idle: [rows[1]+1],
      walk: [rows[1], rows[1]+2, 'walk', 5]
      },
      images: [atb.imagePath + imageFile],
      frames: {
          height: atb.sheet.HERO_FRAME_HEIGHT,
          width:atb.sheet.HERO_FRAME_WIDTH,
          regX: atb.sheet.HERO_REG_X,
          regY: atb.sheet.HERO_REG_Y,
          count: atb.sheet.HERO_FRAMES_PER_SHEET
        }
   });
  return theSheet;
}


/** 
 * @namespace Collection of animation sequences. 
 */
atb.anim = {};


/**
 * Plays the target animation, and invokes the provided function when the 
 * animation completes.
 *
 * @param {Function} anim The function (or name of animation function)
 * @param {Function} onComplete callback when animation completes
 * @param {...} args to be passed to the animation function (optional)
 */
atb.anim.run = function(anim, onComplete) {
  if (arguments.length < 2 || !_.isFunction(onComplete)) {
    throw 'Illegal arguments provided';
  }
  var animArgs = Array.prototype.slice.call(arguments, 2);
  var fn = _.isFunction(anim) ? anim : atb.anim[anim];
  return fn.apply({callback: onComplete}, animArgs);
}

/**
 * Play Battle animation - basic hit(s)
 *
 * @param {createjs.DisplayObject} target for animation
 * @param {number} number of hits
 */
atb.anim.playHitHero = function(target, num) {
  var hitTarget = target;
  var hitChain = [];
  var numHits = num ? num : 1;
  var chainIndex = 0;
  hit = new createjs.BitmapAnimation(atb.sheet.hit);
  hit.x = hitTarget.x+_.random(-30,20);
  hit.y = hitTarget.y+_.random(-10,30);
  hit.scaleX = hit.scaleY = _.random(1,3);
  atb.stage.addChild(hit);

  hit.onAnimationEnd = (function(anim, frame) {
    chainIndex++;
    if (chainIndex >= numHits) {
      anim.stop();
      // delete oneself
      atb.stage.removeChild(anim);
      // call callback, if it exists
      if (this.callback) {
        this.callback.call(); 
      }
      return;
    }
    hit.x = hitTarget.x+_.random(-30,20);
    hit.y = hitTarget.y+_.random(-10,30);
    hit.scaleX = hit.scaleY = _.random(1,3);
  }).bind(this);
  hit.gotoAndPlay("strike");
}


/** TWEENS **/

atb.tweenHeroHit = function(target, reverse, origX) {
  var curPosX = origX ? origX : target.x;
  var dirX = reverse ? -1 : 1;
  var tween = createjs.Tween.get(target, {loop:false})
    .to({x:curPosX-20*dirX, skewX:-5*dirX}, 200, createjs.Ease.bounceOut)
    .to({x:curPosX, skewX:0}, 200, createjs.Ease.bounceIn);
  return tween;
}

atb.tweenHeroDead = function(target, reverse, origX, origY) {
  var curPosX = origX ? origX : target.x;
  var curPosY = origY ? origY : target.Y;
  var dirX = reverse ? -1 : 1;
  var tween = createjs.Tween.get(target, {loop:false})
    .to({x:curPosX-20, rotation: -60*dirX}, 0)
    .to({rotation: -90*dirX, y:curPosY+20}, 200, createjs.Ease.linear);
  return tween;
}

atb.tweenHeroRez = function(target, reverse, origX, origY) {
  var curPosX = origX ? origX : target.x;
  var curPosY = origY ? origY : target.Y;
  var dirX = reverse ? -1 : 1;
  var tween = createjs.Tween.get(target, {loop:false})
    .to({rotation: 0, y:origY, x:origX}, 0);
  return tween;
}

/**
 * Adds one of those cute 'popping' numbers so beloved for showing damage
 * and healing.  Requires an 'anchor' (target DisplayObject) for placement.
 */
atb.EffectNumberGenerator = function(stage) {
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
//    effectNum.shadow = new createjs.Shadow('#333', -2, 2, 2);

    this.stage.addChild(effectNum);

    // runs the 'pop' and once complete removes the number
    var numTween = createjs.Tween.get(effectNum, {loop:false})
      .to({y:effectNum.y-60, scaleX: effectNum.scaleX*1.5, scaleY: effectNum.scaleY*1.5}, 300)
      .to({y:effectNum.y+20, x:effectNum.x + _.random(-25,25), scaleX: effectNum.scaleX, scaleY: effectNum.scaleY, alpha:0.2 }, 400, createjs.Ease.circIn)
      .call(function(tween) { stage.removeChild(effectNum); });

  };
}

