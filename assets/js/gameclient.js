/** Game (Client) **/
function GameClient(myId, emitterCallback) {
  this.players = [];
  this.heroes = [];
  this.myId = myId;
  this.me = null;
  this.enemy = null;

  this.eventsIn = new EventQueue(this['processEvent'].bind(this));
  this.emitterCallback = emitterCallback || function(){};

  this.msgFactory = GameEvent.getFactory(myId);
}

var GC = GameClient.prototype;

/**
 * Sets up game state based on data sent from server
 */
GC.setup = function(gameState) {
  // TODO: here we are mimicking 'receiving' player data from server
  var gameStatePlayers = JSON.parse(gameState);

  for (var i = 0; i < gameStatePlayers.length; i++) {
    // take the raw JSON ver of the 'Player' and mash its data into an
    // empty instance of the Domain Player class.
    var rawPlayer = gameStatePlayers[i];
    // this is ugly as sin.
    var playerToAdd = new Player(rawPlayer.id, rawPlayer.name);
    var party = new Party(rawPlayer.party.id, rawPlayer.party.maxSize);
    _.each(rawPlayer.party.heroes, function(rawHero) {
        party.setHero(_.extend(new Hero(), rawHero));
        });
    playerToAdd.setParty(party);
    this.addPlayers(playerToAdd);

    // this is you!
    if (playerToAdd.id == this.myId) {
      this.me = playerToAdd;
    } else {
      // FIXME: works for 1 enemy only
      this.enemy = playerToAdd;
    }
  }
  this.emitterCallback('clientSetupCompleteEvent');
}
GC.ready = function() {
  this.sendToServer(this.msgFactory.create(GameEvent.type.player_ready));
}

GC.start = function() {
  this.emitterCallback('clientGameStartEvent');
  this.log('Game start!');
}

GC.pause = function() {
  this.emitterCallback('clientGamePauseEvent');
  this.log('Game paused!');
}

GC.resume = function() {
  this.emitterCallback('clientGameResumeEvent');
  this.log('Game resumed!');
}

// TODO: should this even be here?
// to be called by the view's game loop
GC.update = function(speedFactor) {
  // client-side 'smooth gauge'.  Use client speed values to
  // extrapolate gauge, subject to server-sync.
  if (!this.isGameOver) {
    var toUpdate = _.filter(this.heroes, function(curHero) {
        if (!curHero.statuses.dead && !curHero.statuses.ready) {
          // TODO: the 180 should be drawn from something tied to the 
          // clock speed of the server - maybe this can be part of the 
          // setup prcoess.
          curHero.turnGauge += curHero.attributes.speed / speedFactor;
          if (curHero.turnGauge >= 100) {
            curHero.turnGauge = 100.00;
          }
          return true;
        }
        return false;
      });
  }
  return toUpdate;
}

GC.queueEvent = function(type, content) {
  this.eventsIn.push(this.msgFactory.create(type, content));
}

GC.processEvent = function() {
  var theEvent = this.eventsIn.shift();
  var args = theEvent.content;
  if (!theEvent || !theEvent.type) {
    console.log('Client: no event or event type, ignoring.');
    console.log(theEvent);
    return;
  }
  switch (theEvent.type) {
    case GameEvent.type.game_setup_state:
      this.setup(args);
      break;
    case GameEvent.type.game_start:
      this.start();
      break;
    case GameEvent.type.game_pause:
      this.pause();
      break;
    case GameEvent.type.game_resume:
      this.resume();
      break;
    case GameEvent.type.heroes_sync:
      // sync player/hero timing. Use as sanity check for gauge.
      // FIXME: for 'smooth' behaviour, only override with sync value
      // if current value is *really* out of whack (+/- 15% )
      var heroesSync = args;
      for (var i = 0; i < heroesSync.length; i++) {
        var theHero = this.heroes[heroesSync[i][0]];
        var diff = theHero.turnGauge - heroesSync[i][1];
        if (Math.abs(diff) > 15) {
          //                console.log('Client: gauge correction for: ' + theHero.id + ', local='+theHero.turnGauge + ', server='+heroesSync[i][1]);
          theHero.turnGauge -= diff;
        }
        this.emitterCallback('clientHeroUpdateEvent', theHero);
      }
      this.emitterCallback('clientSyncHeroEvent', theHero);
      break;
    case GameEvent.type.heroes_ready:
      var readyHeroes = args;
      for (var i = 0; i < readyHeroes.length; i++) {
        var theHero = this.heroes[readyHeroes[i]];
        theHero.statuses.ready = true;
        theHero.turnGauge = 100.00;
        this.emitterCallback('clientHeroUpdateEvent', theHero);
      }
      break;
    case GameEvent.type.heroes_dead:
      var deadHeroes = args;
      for (var i = 0; i < deadHeroes.length; i++) {
        var theHero = this.heroes[deadHeroes[i]];
        this.log(theHero.name + ' was slain!');
        theHero.statuses.dead = true;
        theHero.statuses.ready = false;
        theHero.turnGauge = 0.00;
        theHero.attributes.hp = 0;
        this.emitterCallback('clientHeroUpdateEvent', theHero);
        this.emitterCallback('clientHeroDeadEvent', theHero);
      }
      break;
    case GameEvent.type.heroes_action:
      // execute action
      var action = args;
      var source = this.heroes[action.by];
      var target = this.heroes[action.target];
      var objectId = action.objectId;
      var isCrit = action.isCrit ? action.isCrit : false;
      var skillId = action.skillId;
      var skill = atb.Skill.get(skillId);

      if (!skill) {
        console.log('Client received unknown action.skillId: ' + skillId);
        break;
      }

      switch(true) {
        case (skillId == atb.Skill.ATTACK):
          var msg = source.name + ' attacks ' + target.name + ' for ' + action.amount + ' damage.';
          if (isCrit) {
            msg += ' (Critical Hit)';
          }
          this.log(msg);
          target.attributes.hp -= action.amount;
          if (target.attributes.hp < 0) {
            target.attributes.hp = 0;
          }
          this.emitterCallback('clientHeroActionEvent', action);
          break;
        case (skillId == atb.Skill.ITEM):
          var item = atb.Item[objectId];
          var itemName = item[atb.Item.field.name];

          this.log(source.name + ' uses ['+ itemName +'] on ' + target.name);
          if (action.isRez) {
            target.statuses.dead = false;
            this.log(target.name + ' was revived!');
            this.emitterCallback('clientHeroRezEvent', target);
          }
          if (action.hp > 0) {
            this.log(target.name + ' was healed for ' + action.hp);
            target.attributes.hp += action.hp;
            if (target.attributes.hp > target.attributes.maxHp) {
              target.attributes.hp = target.attributes.maxHp;
            }
            action.amount = action.hp;
            this.emitterCallback('clientHeroActionEvent', action);
          }
          if (action.sp > 0) {
            this.log(target.name + ' recovered ' + action.sp + ' SP');
            target.attributes.sp += action.sp;
            if (target.attributes.sp > target.attributes.maxSp) {
              target.attributes.sp = target.attributes.maxSp;
            }
            action.effectType = 'heal_sp';
            action.amount = action.sp;
            this.emitterCallback('clientHeroActionEvent', action);
          }
          break;
        case (skillId == atb.Skill.DEFEND):
          // FIXME: as you can see, this does nothing
          this.log(source.name + ' defends!');
          this.emitterCallback('clientResetHeroEvent', source);
          break;

        // FIXME: everything else valid is a 'generic skill'
        default:
          var msg = source.name + ' uses [' + skill.name + '] on ' + target.name + ' for ' + action.amount + ' damage.';
          if (isCrit) {
            msg += ' (Critical Hit)';
          }
          this.log(msg);
          target.attributes.hp -= action.amount;
          if (target.attributes.hp < 0) {
            target.attributes.hp = 0;
          }

          // decrement cost of skill from source
          if (action.cost > 0) {
            source.attributes.sp -= action.cost;
//            console.log(skill.name + ' cost ' + action.cost + '; ' + source.name + ' SP should be set to: ' + source.attributes.sp);
          }
          this.emitterCallback('clientHeroActionEvent', action);
          break;
      }
      break;
    case GameEvent.type.heroes_invalid_action:
      // action was invalidated; turn consumed.
      var source = this.heroes[args.by];
      var skill = atb.Skill.get(args.skillId);
      var msg = source.name + ' could not complete ' + skill.name;
      this.log(msg);
      this.emitterCallback('clientResetHeroEvent', source);
      break;
    case GameEvent.type.player_action:
    case GameEvent.type.player_request_pause:
    case GameEvent.type.player_request_resume:
      // send to server
      this.sendToServer(theEvent);
      break;
    case GameEvent.type.game_over:
      this.gameOver(args);
      break;
    default:
      console.log('Unknown event type: ' + theEvent.type);
      break;
  }
}

// adds the specified players to the game
GC.addPlayers = function(players) {
  for (var i = 0; i < arguments.length; i++) {
    var curPlayer = arguments[i];
    this.players.push(curPlayer);
    for (var j = 0; j < curPlayer.party.heroes.length; j++) {
      var curHero = curPlayer.party.heroes[j];
      // augmenting hero with back-link to player
      curHero.player = curPlayer;
      this.heroes[curHero.id] = curHero;
    }
  }
}

// sends an action to the server.
// FIXME: it writes directly to server's inbound event queue
GC.sendToServer = function(theEvent) {
  gameInstance.queueAction(theEvent);
}

GC.requestPause = function() {
  this.queueEvent(GameEvent.type.player_request_pause);
}

GC.requestResume = function() {
  this.queueEvent(GameEvent.type.player_request_resume);
}

GC.gameOver = function(theWinner) {
  var winner = _.find(this.players, function(thePlayer) { return thePlayer.id == theWinner.id; });
  this.isGameOver = true;
  this.eventsIn.clear();
  $(this.eventsIn).off('queued');

  var msg = null;
  if (winner) {
    if (winner == this.me) {
      msg = 'You have won the battle!';
    } else {
      msg = 'Player ' + winner.name + ' has won the battle!';
    }
  } else {
    msg = 'Game Over!';
  }
  this.log(msg);
  this.emitterCallback('clientGameOverEvent', winner);
}

// a simple message log.  Allows listener to pickup and handle logging
GC.log = function(msg) {
  this.emitterCallback('clientLogEvent', msg)
}
/** END Game (Client) **/


/** CPU Game Client **/

/**
 * The CPU Game Client uses most of the same underlying mechanics as
 * a human player, but overrides the message handling component with
 * AI behaviour.
 */
function CpuGameClient(myId, emitterCallback) {
  GameClient.call(this, myId, emitterCallback);
}
CpuGameClient.prototype = new GameClient();
CpuGameClient.prototype.constructor = CpuGameClient;

var CPUGC = CpuGameClient.prototype;

CPUGC.processEvent = function() {
  var theEvent = this.eventsIn.shift();
  var args = theEvent.content;
  switch (theEvent.type) {
    case GameEvent.type.game_setup_state:
      console.log('CPU Player[' + this.myId + '] setting up state...');
      this.setup(args);
      console.log('CPU Player[' + this.myId + '] is ready!');
      this.ready();
      break;
    case GameEvent.type.heroes_ready:
      var readyHeroes = args;
      var myReadyHeroes = [];
      for (var i = 0; i < readyHeroes.length; i++) {
        var theHero = this.heroes[readyHeroes[i]];                                      theHero.statuses.ready = true;
        theHero.turnGauge = 100.00;
        if (theHero.player.id == this.myId) {
          myReadyHeroes.push(theHero);
        }
      }

      // Always attacks!
      // TODO: pick some other actions.
      var enemyHeroes = this.enemy.party.heroes;
      for (var i = 0; i < myReadyHeroes.length; i++) {
        var target = enemyHeroes[_.random(0, enemyHeroes.length-1)];
        if (target.statuses.dead) {
          target = _.find(enemyHeroes, function(theHero) { return !theHero.statuses.dead });
        }
        if (!target) {
          console.log('CPU Player[' + this.myId + '] ERROR! Could not identify any valid targets. Hero dump follows:');
          console.dir(enemyHeroes);
        }
        this.sendToServer(this.msgFactory.create(GameEvent.type.player_action, {skillId: atb.Skill.ATTACK, by: myReadyHeroes[i].id, target: target.id}));
      }
      break;
    case GameEvent.type.heroes_action:
      // TODO: for now, we only care about actions that rez heroes.
      var source = this.heroes[args.by];
      var target = this.heroes[args.target];
      var objectId = args.objectId;

      switch(args.skillId) {
        case atb.Skill.ITEM:
          var item = atb.Item[objectId];
          var itemName = item[atb.Item.field.name];
          if (args.isRez) {
            target.statuses.dead = false;
          }
          break;
        default:
          // don't care
          break;
      }
      break;
    case GameEvent.type.heroes_dead:                                                  var deadHeroes = args;
      for (var i = 0; i < deadHeroes.length; i++) {
        var theHero = this.heroes[deadHeroes[i]];
        theHero.statuses.dead = true;
        theHero.turnGauge = 0.00;
        theHero.attributes.hp = 0;
      }
      break;
    default:
      // do nothing for now.
      break;
  } // switch
}
/** END CPU Game Client */
