var atb = atb || {};

// REQUIRES: easeljs, tweenjs

// Used for Animations and Sprite Sheets.

/**
 * @constant Base hero sprite scale factor.
 */
atb.HERO_BASE_SCALE = 3;

atb.TARGET_FPS = 60;
atb.BASE_SPEED_FACTOR = 100.00 * 30.00;


// The easeljs stage. MUST be set otherwise none of the animations will work.
atb.stage = {};


/**
 * @namespace pertaining to image assets
 */
atb.img = {
  // path to image assets; defaults to './img/'
  path: 'assets/img/',

  type: {
    'hero': 0, // hero spritesheets
    'bg': 1,   // backdrops
    'anim': 2  // (battle) animation spritesheets
  },

  typePath: {
    0: 'hero/', 
    1: 'bg/',   
    2: 'anim/'
  },

  /**
   * Converts array of image identifiers to preloadjs array manifest
   */
  toPreloadManifest: function(ids) {
    return _.map(ids, function(id) {
        var path = atb.img.path + atb.img.typePath[id[0]];
        var file = null;
        switch(id[0]){
          case atb.img.type.hero:
            file = atb.sheet.heroImage[id[1]];
            break;
          case atb.img.type.bg:
            file = atb.sheet.bgImage[id[1]];
            break;
          case atb.img.type.anim:
            file = atb.sheet.animImage[id[1]];
            break;
          default:
            throw 'Invalid image type specified';
        }
        return path + file;
      });
  }
}

/**
 * @namespace Collection of sprite sheets.
 */
atb.sheet = {};

atb.sheet.BATTLE_ANIM_FRAME_HEIGHT = 96;
atb.sheet.BATTLE_ANIM_FRAME_WIDTH = 96;
atb.sheet.BATTLE_ANIM_REG_X = 48;
atb.sheet.BATTLE_ANIM_REG_Y = 48;

atb.sheet.HERO_FRAME_WIDTH = 24;
atb.sheet.HERO_FRAME_HEIGHT = 32;
atb.sheet.HERO_REG_X = 12;
atb.sheet.HERO_REG_Y = 16;
atb.sheet.HERO_FRAMES_PER_HERO = 12;
atb.sheet.HERO_FRAMES_PER_SHEET = 96; 
atb.sheet.HERO_SLOTS = 8; // i.e. 8 heroes per sheet
atb.sheet.HERO_ROW_SPAN = 4;
atb.sheet.HERO_COL_SPAN = 3;

// ******* VECTOR ASSETS ********

/**
 * @namespace Collection of sprite sheets.
 */
atb.vector= {};

/**
 * Vector Asset - fireball
 */
atb.vector.fireball = new createjs.Shape();
atb.vector.fireball.graphics.setStrokeStyle(1, "round", "round")
  .beginLinearGradientFill(["#ff0","#c30"],[0,0.7],0,100,100,100)
  .moveTo(90,10)
  .lineTo(0,20)
  .arc(0,10, 10,0.5*Math.PI, -0.5*Math.PI, false)
  .lineTo(90, 10);


// ******* SPRITE SHEETS ********

atb.sheet.animImage = [
  'strike.png',
  'sparkle_21x23.png'
];

/**
 * SpriteSheet - Hit animations
 */
atb.sheet.hit = new createjs.SpriteSheet({
    animations: {
        'strike': [0,3, 'strike', 2],
        'slowStrike': [0,3, 'slowStrike', 5],
        'bigStrike': [5,8, 'bigStrike', 4],
        'fireball': [4]
      },
    images: [atb.img.path + atb.img.typePath[atb.img.type.anim] + 'strike.png'],
    frames: {
        height: atb.sheet.BATTLE_ANIM_FRAME_HEIGHT,
        width: atb.sheet.BATTLE_ANIM_FRAME_WIDTH,
        regX: atb.sheet.BATTLE_ANIM_REG_X,
        regY: atb.sheet.BATTLE_ANIM_REG_Y,
        count: 15
      }
  });

/**
 * SpriteSheet - Lightning Bolt
 */
atb.sheet.sparkle = new createjs.SpriteSheet({
    animations: {
        // White only loop
        'white': [0, 12, 'white', 1],
        // Green-white loop
        'green': [13,25, 'greenWhite', 1],
        'greenWhite': [0, 12, 'green', 1],
        // Blue-white loop
        'blue': [26,38, 'blueWhite', 1],
        'blueWhite': [0, 12, 'blue', 1]
      },
    images: [atb.img.path + atb.img.typePath[atb.img.type.anim] + "sparkle_21x23.png"],
    frames: {width:21,height:23,regX:10,regY:11}
  });

/**
 * SpriteSheet - Lightning Bolt
 */
atb.sheet.bolt = new createjs.SpriteSheet({
    animations: {
        'boltSmall': [0],
        'boltBig': [1],
        'ballLightning': [2,5,'ballLightning',1]
      },
    images: [atb.img.path + atb.img.typePath[atb.img.type.anim] + 'bolt1.png'],
    frames: {
        height: atb.sheet.BATTLE_ANIM_FRAME_HEIGHT,
        width: atb.sheet.BATTLE_ANIM_FRAME_WIDTH,
        regX: atb.sheet.BATTLE_ANIM_REG_X,
        regY: atb.sheet.BATTLE_ANIM_REG_Y,
      }
  });

/** 
 * SpriteSheet - Vector fireball
 */
atb.sheet.fireball = (function() {
  var f = atb.vector.fireball;
  f.regX = 60;
  f.regY = 10;
  f.bounds = new createjs.Rectangle(-60,-5,160,25);
  var ssb = new createjs.SpriteSheetBuilder();
  ssb.addAnimation('fireball', ssb.addFrame(f));
  ssb.build();
  return ssb.spriteSheet;
})();

/**
 * SpriteSheet - Ice
 */
atb.sheet.ice = new createjs.SpriteSheet({
    animations: {
        'crystal': [0],
        'frost': [1],
        'spike': [2,4,false,3],
        'shatter': [5],
        'blizzard': [6]
      },
    images: [atb.img.path + atb.img.typePath[atb.img.type.anim] + 'ice1.png'],
    frames: {
        height: atb.sheet.BATTLE_ANIM_FRAME_HEIGHT,
        width: atb.sheet.BATTLE_ANIM_FRAME_WIDTH,
        regX: atb.sheet.BATTLE_ANIM_REG_X,
        regY: atb.sheet.BATTLE_ANIM_REG_Y,
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
        idle_r: [rows[1]+1],
        idle_l: [rows[3]+1],
        walk_r: [rows[1], rows[1]+2, 'walk_r', 5],
        walk_l: [rows[3], rows[3]+2, 'walk_l', 5]
      },
    images: [atb.img.path + atb.img.typePath[atb.img.type.hero] + imageFile],
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

atb.sheet.heroImage = [
  'amber.png', 
  'jergens.png', 
  'chara01.png'
];

atb.sheet.getHeroSheet = function(heroImageId, slotId) {
  return atb.sheet.createHeroSheet(atb.sheet.heroImage[heroImageId], slotId);
}

atb.sheet.bgImage = [
  'plains.png', 
  'forest1.png', 
  'arena.png', 
  'strange.png'
];

/** 
 * @namespace Collection of animation sequences. 
 */
atb.anim = {};

atb.anim.Update = function(onTick, onComplete) {
  this.id = _.uniqueId();

  this.onTick = onTick ? onTick : function() { console.log('Imma custom updatan'); return false; };
  this.onComplete = onComplete ? onComplete : function() { };
}

/**
 * Adds a custom update 'object' to be called by the EaselJS tick handler
 * Update object must implement a function onTick().
 */
atb.anim.addUpdateOnTick = function(update) {
  atb.stage.customUpdates = atb.stage.customUpdates || [];
  atb.stage.customUpdates.push(update);
}

/**
 * Should be called by the tick handler function to update all registered
 * Update objects
 */
atb.anim.runCustomUpdates = function() {
  var updates = atb.stage.customUpdates || [];
  _.each(updates, function(up, index, list) {
      if (!up.onTick()) {        
        // completed updates, delete from stage list
        up.onComplete();
        list[index] = null;
      }
    });

  // discard completed updates, if any
  if (updates.length > 0) {
    atb.stage.customUpdates = _.compact(updates);
  }
}


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
 * Animation Sequence - basic hit(s)
 *
 * @param {createjs.DisplayObject} target for animation
 * @param {number} number of hits
 */
atb.anim.strike = function(target, num) {
  var hitTarget = target;
  var hitChain = [];
  var numHits = num ? num : 1;
  var chainIndex = 0;
  hit = new createjs.BitmapAnimation(atb.sheet.hit);
  hit.x = hitTarget.x+_.random(-30,20);
  hit.y = hitTarget.y+_.random(-10,30);
  hit.scaleX = hit.scaleY = _.random(1,4) / 3;
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
  atb.anim.adjustChannels(hitTarget, num*150, 1, 0.7, 0.3, 1);
  hit.gotoAndPlay("strike");
}

/**
 * Animation Sequence: Large Physical Blow
 */
atb.anim.bigStrike = function(target) {
  var hitTarget = target;
  hit = new createjs.BitmapAnimation(atb.sheet.hit);
  hit.x = hitTarget.x;
  hit.y = hitTarget.y;
  hit.scaleX = hit.scaleY = 3;
  atb.stage.addChild(hit);

  hit.onAnimationEnd = (function(anim, frame) {
    anim.stop();
    // delete oneself
    atb.stage.removeChild(anim);
    if (this.callback) {
      this.callback.call(); 
    }
  }).bind(this);
  atb.anim.adjustChannels(hitTarget, 600, 1, 0.7, 0, 1);
  hit.gotoAndPlay("bigStrike");
}

/**
 * Animation Sequence: Sparkles floating up
 */
atb.anim.sparklesUp = function(target, numSparkles, type) {
  var sparkles = [];
  var num = numSparkles ? numSparkles : 1;
  var sparkType = type && atb.sheet.sparkle.getAnimation(type) ? type : 'white';
  var thresholdY = target.y > 100 ? target.y-100 : 0;
  
  switch (sparkType) {
    case 'blue':
      atb.anim.adjustChannels(target, 500, 0.6, 0.3, 1, 1);
      break;
    default:
      atb.anim.adjustChannels(target, 500, 0.6, 1, 0.3, 1);
      break;
  }
  // add the desired number of sparkles, positioned randomly
  var sparkleAnim = new createjs.BitmapAnimation(atb.sheet.sparkle);
  for (var i=0; i<num; i++) {
    sparkle = sparkleAnim.clone();
    sparkle.x = target.x+_.random(-30,20);
    sparkle.y = target.y+_.random(30,50);
    sparkle.vY = _.random(12,25) / 3;
    sparkle.vA = _.random(2,4) / 150;
    sparkle.scaleX = sparkle.scaleY = _.random(4,8) / 2;
    sparkle.gotoAndPlay(sparkType);
    atb.stage.addChild(sparkle);
    sparkles.push(sparkle);
  }

  // custom update function
  var up = new atb.anim.Update();
  up.sparkles = sparkles;
  if (this.callback) {
    up.onComplete = this.callback;
  }
  up.onTick = function() {
    _.each(this.sparkles, function(sparkle, index) {
      if (!sparkle) {
        return;
      }
      sparkle.y -= sparkle.vY;
      sparkle.alpha -= sparkle.vA;
      sparkle.scaleX = sparkle.scaleY -= sparkle.vA;
      if (sparkle.alpha <= 0.15 || sparkle.y < thresholdY) {
        atb.stage.removeChild(sparkle);
        this.sparkles[index] = null;
      }
    }, this);
    this.sparkles = _.compact(this.sparkles);
    return (this.sparkles.length > 0);
  }
  atb.anim.addUpdateOnTick(up);
}

/**
 * Animation Sequence: Lightning Strike
 */
atb.anim.bolt = function(target, duration) {
  var boltAnim = new createjs.BitmapAnimation(atb.sheet.bolt);

  boltAnim.gotoAndPlay('boltSmall');
  boltAnim.scaleX = 2;
  boltAnim.scaleY = 3;
  boltAnim.alpha = 0.5;
  boltAnim.shadow = new createjs.Shadow('rgba(255,255,255,0.9)',0,0,5);

  var duration = 300;
  var boltMask = new createjs.Shape();
  var maskWidth = atb.sheet.BATTLE_ANIM_FRAME_WIDTH * boltAnim.scaleX;
  var maskHeight = atb.sheet.BATTLE_ANIM_FRAME_HEIGHT * boltAnim.scaleY;
  boltMask.graphics.drawRect(0, 0, maskWidth, maskHeight).closePath();
  boltMask.regX = maskWidth/2;
  boltMask.regY = maskHeight/2;

  // set positions
  boltAnim.x = target.x;
  boltAnim.y = target.y + 40 - maskHeight/2;
  boltMask.x = boltAnim.x;
  boltMask.y = boltMask.origY = boltAnim.y - maskHeight;

  boltAnim.mask = boltMask;

  atb.stage.addChild(boltAnim);

  var boltMaskTween = createjs.Tween.get(boltMask, {loop:false})
    .to({y: boltMask.y + maskHeight}, duration*1.4, createjs.Ease.cubicOut)
    .to({y: boltMask.y + 2*maskHeight}, duration*0.6, createjs.Ease.cubicIn);
  var boltTween = createjs.Tween.get(boltAnim, {loop:false})
    .to({alpha: 1}, duration*0.8)
    .call(atb.anim.adjustChannels, [target, duration, 1, 1, 0.3, 1])
    .set({shadow: new createjs.Shadow('rgba(255,255,255,0.9)',0,0,25)}, boltAnim)
    .to({alpha: 0}, duration*1.2, createjs.Ease.cubicIn)
    .call(function() { atb.stage.removeChild(boltAnim); });
  var targetTween = createjs.Tween.get(target, {loop:false})
    .wait(duration*0.8)
    .to({x: target.x-10}, duration*0.3, createjs.Ease.elasticOut)
    .to({x: target.x+10}, duration*0.3, createjs.Ease.elasticOut)
    .to({x: target.origX}, duration*0.3, createjs.Ease.elasticIn)
    .call(this.callback ? this.callback : function(){});
}

/**
 * Animation Sequence: Rain of Fire
 */
atb.anim.rainOfFire = function(target, num, duration) {
  var totalDuration = num*40+duration;
  var aoe = 35;

  fireAnim = new createjs.BitmapAnimation(atb.sheet.hit);
  fireVector = new createjs.BitmapAnimation(atb.sheet.fireball);

  function dropFireball(target, source) {
    var fireball = source.clone();
    fireball.gotoAndPlay('fireball');

    fireball.x = target.x - _.random(120, 150);
    fireball.y = target.y - _.random(245, 285);
    fireball.scaleX = fireball.scaleY = _.random(30,40)/40;
    fireball.rotation = -160;
    fireball.alpha = 0.7 + _.random(0,10)/10;
    atb.stage.addChild(fireball);

    var tween = createjs.Tween.get(fireball, {loop:false})
      .to({x: target.x-10+_.random(-aoe,aoe), y:target.y+_.random(-aoe,aoe), rotation: -100}, duration, createjs.Ease.circIn)
      .to({alpha: 0}, duration/4)
      .call(function() { atb.stage.removeChild(fireball); });
  }

  atb.anim.adjustChannels(target, totalDuration, 1, 0.7, 0.3, 1);
  var tween = createjs.Tween.get(this, {loop:false});
  for (var i=0; i<num; i++) {
    tween.wait(_.random(30+i,50+i)).call(dropFireball, [target, (i%2==0) ? fireAnim: fireVector])
  }
  tween.wait(duration).call(this.callback ? this.callback : function(){});
}

atb.anim.frostSpike = function(target) {
  var duration = 370;
  var iceBase = new createjs.BitmapAnimation(atb.sheet.ice);
  iceBase.x = target.x;
  iceBase.alpha = 0.6;

  for (var i=0; i<3; i++) {
    var iceAnim = iceBase.clone();
    iceAnim.y = target.y -50 - 20*i;
    iceAnim.scaleX = iceAnim.scaleY = 2+i/2;
    iceAnim.shadow = new createjs.Shadow('rgba(60,190,255,1)',0,0,10*i);
    iceAnim.gotoAndPlay('spike');
    atb.stage.addChild(iceAnim);
    var tween = createjs.Tween.get(iceAnim, {loop:false})
      .wait(duration-100)
      .call(atb.anim.sparklesUp, [target, 6, 'blue'])
      .to({alpha: 0, scaleX: 6, scaleY: 5, y:iceAnim.y-100}, duration-i*120)
      .call(function() { atb.stage.removeChild(iceAnim); });
  }
  createjs.Tween.get(this, {loop:false})
    .wait(duration*2)
    .call(this.callback ? this.callback : function(){});
}

/**
 * Adjusts R,G,B and alpha channels for target DisplayObject via a ColorFilter.
 * Will revert to original after duration has elapsed. Should not interfere
 * with any other filters.
 */
atb.anim.adjustChannels = function(target, duration, r, g, b, a) {
  // FIXME: hardcoded to work only vs. hero sprites
  var adjFilter = new createjs.ColorFilter(r,g,b,a);
  target.filters ? target.filters.push(adjFilter) : target.filters = [adjFilter];
  target.cache(-atb.sheet.HERO_REG_X, -atb.sheet.HERO_REG_Y, atb.sheet.HERO_FRAME_WIDTH, atb.sheet.HERO_FRAME_HEIGHT);

  _.delay(function(target) { 
      if (!target.filters) {
        // if for some reason, the filters were purged.
        return;
      }
      for (var i=0; i<target.filters.length; i++) {
        if (target.filters[i] == adjFilter) {
          target.filters[i] = null;
          target.filters = _.compact(target.filters);
          break;
        }
      }
      target.updateCache();
    }, duration, target);
}

atb.anim.flashScreen = function(colour, duration, intensity) {
  var flashScreen = new createjs.Shape();
  flashScreen.graphics.beginFill(colour).drawRect(0, 0, atb.stage.canvas.width, atb.stage.canvas.height).endFill();
  flashScreen.alpha = 0.0;
  atb.stage.addChild(flashScreen);

  createjs.Tween.get(flashScreen, {loop:false})
    .to({alpha: intensity}, duration/2,  createjs.Ease.cubicOut)
    .to({alpha: 0}, duration/2,  createjs.Ease.cubicIn)
    .call(function() { atb.stage.removeChild(flashScreen); });
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


/**
 * Convenience method that, if the 'hit' is to a now dead hero, show the
 * death tween instead of the hit tween.  Otherwise, use the hit tween.
 */
atb.tweenHeroHitOrDead = function(target, reverse, origX, origY, isDead) {
  if (isDead) {
    atb.tweenHeroDead(target, reverse, origX, origY);
  } else {
    atb.tweenHeroHit(target, reverse, origX, origY);
  }
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
    var scaleFactor = isCrit ? 2.0 : 1.5;
    var isHeal = type && type == 'heal';
    var theColor = isCrit ? '#ff3' : '#fff';
    if (type) {
      switch(type) {
        case 'heal':
          theColor = isCrit ? '#3f7' : '#2e6';
          theNum = '+' + num;
          break;
        case 'heal_sp':
          theColor = isCrit ? '#0df' : '#0cf';
          theNum = '+' + num;
          break;
        default:
          break;
      } // switch
    }
    var theFont = isCrit ? 'bold 22px Arial' : 'bold 20px Arial';
    var effectNum = new createjs.Text(theNum, theFont, theColor);
    effectNum.x = anchor.x - anchor.regX + (_.random(-5,5));
    effectNum.y = anchor.y - anchor.regY + (_.random(-15,-5));
    effectNum.regY = 0;
    effectNum.textAlign = "center";
    effectNum.shadow = new createjs.Shadow('#333', -2, 2, 0);

    this.stage.addChild(effectNum);

    // runs the 'pop' and once complete removes the number
    var numTween = createjs.Tween.get(effectNum, {loop:false})
      .to({y:effectNum.y-40*scaleFactor, scaleX: effectNum.scaleX*scaleFactor, scaleY: effectNum.scaleY*scaleFactor}, 300)
      .to({y:effectNum.y+20, x:effectNum.x + _.random(-25,25), scaleX: effectNum.scaleX, scaleY: effectNum.scaleY, alpha:0.2 }, 400, createjs.Ease.circIn)
      .call(function(tween) { stage.removeChild(effectNum); });

  };
}

