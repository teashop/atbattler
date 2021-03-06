/** Skills Database **/

exports.SkillData = [
  [0, 'Attack', 'Attack with equipped weapon'],
  [1, 'Defend', 'Increases defenses by 25% for one turn'],
  [2, 'Item', 'Use an Item from your inventory'],
  [3, 'Flee', 'Escape from battle'],
  [4, 'Mighty Swing', 'Deals physical damage to target', [0, 10]],
  [5, 'Flare', 'Deals Fire damage to target', [0, 25]],
  [6, 'Arc Impulse', 'Deals Lightning damage to target', [0, 25]],
  [7, 'Blast Chill', 'Deals Frost damage to target', [0, 25]],
  [8, 'Shockwave', 'Deals physical damage to all enemies', [0, 50]]
];


/** 
 * Convenience encapsulation of SkillData.
 */
exports.Skill = function(id) {
  this.id = id;
  this.data = exports.SkillData[this.id];

  if (!this.data) {
    throw 'Invalid Skill id specified';
  }

  /**
   * Converts cost field array into key-value object.  If cost DNE, returns 
   * null. 
   */
  function toCostObject(cost) {
    if (cost) {
      var theCost = {};
      theCost.hp = cost[0] ? cost[0] : 0;
      theCost.sp = cost[1] ? cost[1] : 0;
      return theCost;
    } else {
      return null;
    }
  }

  this.name = this.data[exports.Skill.field.name];
  this.desc = this.data[exports.Skill.field.desc];
  this.cost = toCostObject(this.data[exports.Skill.field.cost]);
}

// Field enumeration for SkillData attay
exports.Skill.field = {
  id: 0,
  name: 1,
  desc: 2,
  cost: 3
}

{
  var SKILL = exports.Skill.prototype;

  /**
   * Determines if the given hero/target state satisfies the prerequisites to
   * execute the given skill.  Assumes nothing about the target(s).
   * 
   * @return {boolean} true iff the provided state satisfies skill prereqs.
   */
  SKILL.meetsPrereqCast = function(hero) {
    // TODO: generalize for other skills, including items.
    var skillCost = this.cost;
    var skillCostSp = 0;
    
    var meetsPrereqs = true;

    if (skillCost) {
      meetsPrereqs = (hero.attributes.sp >= skillCost.sp 
        && hero.attributes.hp >= skillCost.hp);
    }
    return (meetsPrereqs && !hero.statuses.dead);
  }

  SKILL.meetsPrereq = function(hero, target) {
    return (this.meetsPrereqCast(hero)
      && !target.statuses.dead);
  }

  /**
   * Deducts the skill cost from the executing hero. Assumes hero meets 
   * prerequisites to execute skill.
   *
   * @param {Hero} hero to deduct Skill cost from.
   */
  SKILL.payCost = function(hero) {
    var skillCost = this.cost;
    if (skillCost) {
      hero.attributes.hp -= skillCost.hp;
      hero.attributes.sp -= skillCost.sp;
    }
  }
}


/**
 * Retrieves a Skill object representing the Skill for the given id.
 *
 * @return {Skill} the Skill.  If no such Skill exists, return null;
 */
exports.Skill.get = function(id) {
  return exports.Skill.isValid(id) ? new exports.Skill(id) : null;
}


// Convenience lookups for 'command' skills
exports.Skill.ATTACK = 0;
exports.Skill.DEFEND = 1;
exports.Skill.ITEM = 2;
exports.Skill.FLEE = 3;

// FIXME: this is a hack to specify the range of 'everything else'
exports.Skill.SKILLS_START = 4;


exports.Skill.isValid = function(skillId) {
  return exports.SkillData[skillId] ? true : false; 
}
