/** === DOMAIN === **/
function rollPlayerHero(id, name) {
	var theHp =  _.random(1000, 1300);
	var theSp =  _.random(100, 300);
	var attributes = {
		speed: _.random(100, 130),
		attack: _.random(200, 220),
		hp: theHp,
		maxHp: theHp,
		sp: theSp,
		maxSp: theSp
	};
	return new Hero(id, name, attributes);
}
function rollCpuHero(id, name) {
	var theHp = _.random(1200, 1700);
	var theSp =  _.random(300, 500);
	var attributes = {
		speed: _.random(80, 100),
		attack: _.random(90, 390),
		hp: theHp,
		maxHp: theHp,
		sp: theSp,
		maxSp: theSp
	};
	return new Hero(id, name, attributes);
}
/** Hero **/
function Hero(id, name, attributes) {
	this.id = id;
	this.name = name;

	// TODO: put somewhere else
	this.attributes = attributes;
	this.statuses = {};

	// TODO: mechanics should be managed by game state
	this.turnGauge = 0.00;
}
/** END Hero **/

/** Party **/
function Party(id, maxSize) {
	this.id = id;
	this.maxSize = maxSize;

	this.heroes = [];
}
var PARTY = Party.prototype;

// TODO: if position is OOB or party is full
PARTY.setHero = function(hero, position) {
	var thePosition = position;
	if (position) {
		this.heroes[position] = hero;
	} else {
		for (var i = 0; i < this.maxSize; i++) {
			if (!this.heroes[i]) {
				this.heroes[i] = hero;
				thePosition = i;
				break;
			}
		}
	}
	return thePosition;
}
// TODO: if position is OOB or party is empty
PARTY.removeHero = function(position) {
	if (position < this.maxSize) {
		this.heroes[position] = null;
	}
	return hero;
}

PARTY.getHeroById = function(heroId) {
	for (var i = 0; i < this.heroes.length; i++) {
		if (this.heroes[i] && this.heroes[i].id == heroId) {
			return this.heroes[i];
		}
	}
	return null;
}

// TODO: JSONify
/** END Party **/

/** Player **/
function Player(id, name) {
	this.id = id;
	this.name = name;

	this.party = null;
}

var PLAYER = Player.prototype;

PLAYER.setParty = function(party) {
	this.party = party;
}

/** END Player **/
