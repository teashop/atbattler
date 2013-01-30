var http = require('http');
var sockjs = require('sockjs');
var events = require('events');
var util = require('util');

// ATB modules
var atbDomain = require('./assets/js/domain');
var atbItem = require('./assets/js/item');
var atbUtil = require('./assets/js/util');
var atbGameInstance = require('./assets/js/gameinstance');
var atbGameClient = require('./assets/js/gameclient');

var atb = atb || exports;

var PORT = 8000;

var atbServer = sockjs.createServer();
atbServer.on('connection', onConnection);

var server = http.createServer();
atbServer.installHandlers(server, {
    prefix:'/atb',
    log: sockJsLog
  });
server.listen(PORT); 

/**
 * Logging for sockJS
 */
function sockJsLog(sev, msg) {
  if (sev != 'debug' && sev != 'info') {
    console.error(msg);
//  else if (config.DEBUG)
  } else {
    console.log(msg);
  }
}


var clock = new atbUtil.Clock(1000/60);
var gameInstance = new atbGameInstance.GameInstance(clock);

var player = null;
var party = new atbDomain.Party(1, 4);

// FIXME: should have a consolidated hero generator/persistence.
var genHeroes= [];
genHeroes.push(atbDomain.rollPlayerHero(1, 'Jergens'));
genHeroes.push(atbDomain.rollPlayerHero(2, 'Milton'));
genHeroes.push(atbDomain.rollPlayerHero(3, 'Haruka'));
genHeroes.push(atbDomain.rollPlayerHero(4, 'Leena'));
for (var i=0; i<genHeroes.length; i++) {
  party.setHero(genHeroes[i]);
}
party.heroes[0].img = [1, 3];
party.heroes[1].img = [1, 0];
party.heroes[2].img = [0, 4];
party.heroes[3].img = [1, 4];
/*
player.sendMessage = function(message) {
  console.log('Player got msg: ' + JSON.stringify(message));
  gameClient.eventsIn.push(message);
};
*/

var enemy = new atbDomain.Player(2, 'Enemy');
var enemyParty = new atbDomain.Party(1, 4);
enemyParty.setHero(atbDomain.rollCpuHero(100, 'Teh Badguy'));
enemyParty.setHero(atbDomain.rollCpuHero(200, 'Wagglerstein'));
enemyParty.setHero(atbDomain.rollPlayerHero(201, 'Shopgirl 10K'));
enemyParty.heroes[0].img = [2, 2];
enemyParty.heroes[1].img = [2, 0];
enemyParty.heroes[2].img = [2, 7];
enemy.setParty(enemyParty);
enemy.sendMessage = function(message) {
//  console.log('CPU got msg: ' + JSON.stringify(message));
  cpuGameClient.eventsIn.push(message);
}



var cpuGameClient = new atbGameClient.CpuGameClient(enemy.id);
cpuGameClient.gameInstance = gameInstance;

/*
var gameClient = new atbGameClient.CpuGameClient(player.id);
gameClient.gameInstance = gameInstance;
gameInstance.setup();
*/

/** 
 * Socket Client
 */
 /*
function Client(conn) {
  this.conn = conn;
  this.id = ++CLIENT_CTR;
  this.name = null;
  this.opts = {};
// ** Chat Client
function Client(conn) {
  this.conn = conn;
  this.id = ++CLIENT_CTR;
  this.name = null;
  this.opts = {};
}
util.inherits(Client, events.EventEmitter);
var C = Client.prototype;
// Client - data received from client
C.onMessage = function(data) {
  var msg;
  console.log('Raw Message:' + data);
    try {
        msg = JSON.parse(data);
    }
    catch (e) {
        this.drop('Bad JSON.');
        return;
  }
}
// Client - disconnect
C.onDisconnect = function() {
  console.log('    [-] closing connection for client: ' + this.id + ', conn:' + this.conn);
  this.emit('disconnected');
  this.conn.removeAllListeners();
  this.removeAllListeners();
}
// Client - send message to client
C.send = function(msg) {
  this.conn.write(msg);
}
// ** END client


// The Game - TODO: these are globals, yo.
var gameInstance = null;

*/

var playerConn = null;
function onConnection(conn) {
  playerConn = conn;
  // handlers - bind to client
  conn.on('data', function(data) {
      if (!player) {
        var id = data;
        player = new atbDomain.Player(data, 'You');
        player.setParty(party);
        player.sendMessage = function(message) {
          //console.log(message);
          playerConn.write(JSON.stringify(message));
        };
        gameInstance.addPlayers(player, enemy);
        gameInstance.setup();
      } else {
        gameInstance.queueAction(JSON.parse(data));
      }
    });

  conn.once('close', function() {});
}

