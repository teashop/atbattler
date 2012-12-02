/** Default Game Over condition = 1 player dead **/
function gameOverDefault(gameInstance) {
  var deadPlayer = null;
  var players = gameInstance.players;
  for (var i = 0, len = players.length; i < len; i++) {
    var curPlayer = players[i];
    // every hero in the party is dead
    if (_.all(_.pluck(curPlayer.party.heroes, 'statuses'), function(statuses) { return statuses.dead; })) {
      deadPlayer = curPlayer;
      break;
    }
  } // for i

  // return the winner, if any
  if (deadPlayer) {
    var winner = _.filter(players, function(curPlayer) {
        return(curPlayer.id != deadPlayer.id);
        }, this);
    return winner[0];
  }
  return false;
}

// dispatches based on GameEvent type.
var GameInstanceDispatcher = {
    methods: {},

    dispatch: function(type, from, args, instanceContext) {
      return GameInstanceDispatcher.methods[type].call(instanceContext, from, args);
    }
};
var GIDM = GameInstanceDispatcher.methods;

GIDM[GameEvent.type.game_tick] = function(from, args) {
      // update real-tick-based stuff
      this.doTickUpkeep();
    }
GIDM[GameEvent.type.game_duration_tick] = function(from, args) {
  // update duration-based stuff.  Filter out completed events.
//     this.durationEventTracker = this.durationEventTracker.filter(this.updateDurationEvent(theEvent));
  var sync = _.map(this.heroes, function(theHero) {
    return [theHero.id, theHero.turnGauge];
  });
  this.queueOutbound(GameEvent.type.heroes_sync, sync);
},
GIDM[GameEvent.type.player_action] = function(from, args) {
  // execute action
  this.executeAction(args);
},
GIDM[GameEvent.type.player_request_pause] = function(from, args) {
  // FIXME: blind pause, no consensus required
  this.fsm.triggerPause();
},
GIDM[GameEvent.type.player_request_resume] = function(from, args) {
  // FIXME: blind resume, no consensus required
  this.fsm.triggerResume();
},
GIDM[GameEvent.type.player_ready] = function(from, args) {
  // FIXME: need to id msgs with a proper 'sender', which would be inherent from the receiving communication
  // for now, any 'ready' message starts the game.
  console.log('GI: player_ready received from Player [' + from + '].');
  if (this.registerReadyPlayer) {
    this.registerReadyPlayer();
  } else {
    console.log('No player ready registration function available');
  }
}


/** Game Instance (Server) **/
function GameInstance(clock) {
  // the players
  this.players = [];
  // convenience map for direct access
  this.heroes = {};
  // defines the conditions under which the game ends.
  this.gameOverConditions = [];
  this.isGameOver = false;

  // Game state machine
  this.fsm = StateMachine.create({
      target: this,
      initial: 'new',
      events: [
      { name: 'triggerDoSetup',  from: 'new',  to: 'setup' },
      { name: 'triggerAllReady', from: 'setup', to: 'running' },
      { name: 'triggerPause',  from: 'running', to: 'paused' },
      { name: 'triggerResume',  from: 'paused', to: 'running' },
      { name: 'triggerGameOver', from: ['running', 'paused'], to: 'gameOver' }
    ]});

  // Game clock
  this.clock = clock;
  // 'Real Clock' Duration clock
  this.durationClock = new Clock(SECOND*0.5);

  // Event Queues
  this.eventsIn = new EventQueue(this['processInbound'].bind(this));
  this.eventsOut = new EventQueue(this['processOutbound'].bind(this));

  // Msg Factory
  this.msgFactory = GameEvent.getFactory('GI'); // FIXME (instance ID)

  // duration based events to keep track of
  this.durationEventTracker = [];

  // handlers
  $(this.clock).on('tick', this['onTick'].bind(this));
  $(this.durationClock).on('tick', this['onDurationTick'].bind(this));
}

var GI = GameInstance.prototype;

// adds the specified players to the game
GI.addPlayers = function(players) {
  for (var i = 0; i < arguments.length; i++) {
    var curPlayer = arguments[i];
    this.players.push(curPlayer);
    for (var j = 0; j < curPlayer.party.heroes.length; j++) {
      var curHero = curPlayer.party.heroes[j];
      this.heroes[curHero.id] = curHero;
    }
  }
  // TODO: players need to augmented with connectivity to their respective clients.
}

// adds the specified game over conditions to the game
GI.addGameOverConditions = function(conditions) {
 this.gameOverConditions = this.gameOverConditions.concat(arguments);
}

GI.checkGameOverConditions = function() {
  var winner = null;
  for (var i = 0; i < this.gameOverConditions.length; i++) {
    winner = this.gameOverConditions[i](this);
    if (winner) {
      // any condition is enogh to trigger Game Over
      this.fsm.triggerGameOver(winner);
      return true;
    }
  }
  return false;
}

// Call once all players have been added to the game;
// this begins the setup process
GI.setup = function() {
  this.fsm.triggerDoSetup();
}

// Finalize Instance params then push game data down to Players.
GI.onsetup = function() {
  console.log('GI: onsetup() called, initializing game instance.');
  // no game over conditions assigned, use the default
  if (this.gameOverConditions.length <= 0) {
    this.gameOverConditions.push(gameOverDefault);
  }

  // Setup to collect 'ready' replies - for now, a simple check that
  // starts the game when number of replies == number of Players.
  // TODO: deal with possibility of timeouts
  this.registerReadyPlayer = _.after(this.players.length, this.fsm.triggerAllReady);
  // Push state to players.
  this.queueOutbound(GameEvent.type.game_setup_state, JSON.stringify(this.players));
}

// start game when all players are ready
GI.ontriggerAllReady = function() {
  console.log('GI: All Players ready, starting game NOW!');
  this.start();
  this.queueOutbound(GameEvent.type.game_start);
  }

GI.onpaused = function() {
  console.log('GI: Game was paused.');
  this.stop();
  this.queueOutbound(GameEvent.type.game_pause);
}
GI.ontriggerResume = function() {
  console.log('GI: Game is resumed.');
  this.start();
  this.queueOutbound(GameEvent.type.game_resume);
}

GI.ongameOver = function(evt, from, to, winner) {
  this.stop();
  this.isGameOver = true;
  this.eventsIn.clear();
  this.queueOutbound(GameEvent.type.game_over, winner ? winner : '');
  $(this.clock).off('tick');
  $(this.durationClock).off('tick');
}

/**
 * Starts the game
 */
GI.start = function() {
  this.clock.start();
  this.durationClock.start();
}
GI.stop = function() {
  this.clock.stop();
  this.durationClock.stop();
}
GI.onTick = function() {
  this.queueInbound(GameEvent.type.game_tick);
}
GI.onDurationTick = function() {
  this.queueInbound(GameEvent.type.game_duration_tick);
}
// TODO: this is a hack to allow local comms from client.
GI.queueAction = function(action) {
  this.eventsIn.push(action);
}
GI.queueInbound = function(type, content) {
//  console.log('queueing in: type=' + type + ', content= ' + content);
  this.eventsIn.push(this.msgFactory.create(type, content));
}
GI.queueOutbound = function(type, content) {
//  console.log('queueing out: type=' + type + ', content= ' + content);
  this.eventsOut.push(this.msgFactory.create(type, content));
}

// Perform upkeep on a real-time tick basis
GI.doTickUpkeep = function() {
  // TODO: do the rest of the stuff!
  this.update();
}
// execute an action
GI.executeAction = function(action) {
  var results = [];
  // FIXME: this precludes dual-tech/triple-tech etc.
  var actor = this.heroes[action.by];
  var target = this.heroes[action.target];
  // drop actions from non-ready actors
  if (!actor || !actor.statuses.ready) {
    console.log('GI: ' + actor.name + ' is not ready; ignoring action request');
    return;
  }
  // TODO: these should be in handlers or something more organized
  switch(action.type) {
    case 'attack':
    case 'skill':
      var dmg = actor.attributes.attack * (_.random(95, 105)/100); //5% variance for now.
      // 5% crit chance for now
      var isCrit = (_.random(0,99)) < 5;
      if (isCrit) {
        dmg *= 1.5;
      }
      dmg = Math.round(dmg);
      var overkill = 0;
      target.attributes.hp -= dmg;
      results.push(this.msgFactory.create(GameEvent.type.heroes_action, {type: action.type, by: actor.id, target: target.id, amount: dmg, isCrit: isCrit}));
      if (target.attributes.hp <= 0) {
        overkill = -(target.attributes.hp);
        target.attributes.hp = 0;
        target.statuses.dead = true;
        results.push(this.msgFactory.create(GameEvent.type.heroes_dead, [target.id]));
      }
      // reset actor
      actor.statuses.ready = false;
      actor.turnGauge = 0.00;
      break;
    case 'item':
      // FIXME: this is a placeholder for a 'heal'
      // Heals 20% of maxHp
      var amount = Math.round(target.attributes.maxHp * 0.20);
      target.attributes.hp += amount;
      if (target.attributes.hp > target.attributes.maxHp) {
        target.attributes.hp = target.attributes.maxHp;
      }
      results.push(this.msgFactory.create(GameEvent.type.heroes_action, {type: 'item', by: actor.id, target: target.id, amount: amount}));
      // reset actor
      actor.statuses.ready = false;
      actor.turnGauge = 0.00;
      break;
    default:
      console.log('GI: Unknown action type ' + action.type);
      break;
  } // switch

  // FIXME: special case, i can't handle a multi-push yet.
  for (var i = 0; i < results.length; i++) {
    this.eventsOut.push(results[i]);
  }
}

// Inbound event processor
GI.processInbound = function() {
  var theEvent = this.eventsIn.shift();
  if (!theEvent || !theEvent.type) {
    console.log('GI: no event or event type, ignoring.');
    return;
  }
  GameInstanceDispatcher.dispatch(theEvent.type, theEvent.from, theEvent.content, this);
}

GI.processOutbound = function() {
  var theEvent = this.eventsOut.shift();

  // FIXME: this is just a simulated broadcast.
  // GLOBAL
  async.forEach(this.players, function(player, cb) { 
      player.sendMessage(theEvent); cb(null); }, 
      function(err) {
//        console.log('GI: broadcast of Event:' + theEvent.type + ' completed');
      });
}

// Game-clock ticks
GI.update = function() {
  if (this.isGameOver || this.checkGameOverConditions()) {
    return;
  }
  // hero ready condition
  var newlyReady = _.filter(this.heroes, function(curHero) {
      if (curHero && !curHero.statuses.dead && !curHero.statuses.ready) {
        curHero.turnGauge += curHero.attributes.speed / 100.00;
        if (curHero.turnGauge >= 100) {
          curHero.statuses.ready = true;
          curHero.turnGauge = 100.00;
          return true;
        }
      }
      return false;
    });
  // broadcast new ready heroes to clients
  // TODO
  if(newlyReady.length > 0) {
    this.queueOutbound(GameEvent.type.heroes_ready, _.pluck(newlyReady, 'id'));
  }
}

/** END Game Instance (server) **/

