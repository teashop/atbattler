/** Skills Database **/

var atb = atb || {};

atb.SkillData = [
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
atb.Skill = function(id) {
  this.id = id;
  this.data = atb.SkillData[this.id];

  if (!this.data) {
    throw 'Invalid Skill id specified';
  }
  this.name = this.data[atb.Skill.field.name];
  this.desc = this.data[atb.Skill.field.desc];
  this.cost = this.data[atb.Skill.field.cost];
}

atb.Skill.field = {
  id: 0,
  name: 1,
  desc: 2,
  cost: 3
}

{
  var SKILL = atb.Skill.prototype;

  /**
   * Determines if the given hero/target state satisfies the prerequisites to
   * execute the given skill
   * 
   * @return {boolean} true iff the provided state satisfies skill prereqs.
   */
  SKILL.meetsPrereqCast = function(hero) {
    // TODO: generalize for other skills, including items.
    var skillCost = this.cost;
    var skillCostSp = 0;
    
    if (skillCost && skillCost[1]) {
      skillCostSp = skillCost[1];
    }
    return (!hero.statuses.dead 
      && hero.attributes.sp >= skillCostSp);
  }
  SKILL.meetsPrereq = function(hero, target) {
    return (this.meetsPrereqCast(hero)
      && !target.statuses.dead);
  }

  /**
   * Extracts the skill cost from the executing hero. Assumes hero meets 
   * prerequisites to execute skill.
   *
   * @return {array} the extracted costs, analogous to the cost field in the 
   *    Skill record.
   */
  SKILL.payCost = function(hero) {
    var skillCost = this.cost;
    var skillCostSp = skillCost && skillCost[1] ? skillCost[1] : 0;

    // FIXME only doing SP...
    hero.attributes.sp -= skillCostSp;
    return skillCostSp; 
  }
}


/**
 * Retrieves a Skill object representing the Skill for the given id.
 * @return {Skill} the Skill.  If no such Skill exists, return null;
 */
atb.Skill.get = function(id) {
  return atb.Skill.isValid(id) ? new atb.Skill(id) : null;
}


// Convenience lookups for 'command' skills

atb.Skill.ATTACK = 0;
atb.Skill.DEFEND = 1;
atb.Skill.ITEM = 2;
atb.Skill.FLEE = 3;

// FIXME: this is a hack to specify the range of 'everything else'
atb.Skill.SKILLS_START = 4;


atb.Skill.isValid = function(skillId) {
  return atb.SkillData[skillId] ? true : false; 
}

