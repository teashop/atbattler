/** Skills Database **/

var atb = atb || {};

atb.Skill = [
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


atb.Skill.field = {
  id: 0,
  name: 1,
  desc: 2,
  cost: 3
}

// Convenience lookups for 'command' skills

atb.Skill.ATTACK = 0;
atb.Skill.DEFEND = 1;
atb.Skill.ITEM = 2;
atb.Skill.FLEE = 3;

// FIXME: this is a hack to specify the range of 'everything else'
atb.Skill.SKILLS_START = 4;


atb.Skill.isValid = function(skillId) {
  return (skillId >= 0 && skillId < atb.Skill.length);
}

/**
 * Determines if the given hero/target state satisfies the prerequisites to
 * execute the given skill
 * 
 * @return {boolean} true iff the provided state satisfies skill prereqs.
 */
atb.Skill.meetsPrereq = function(skillId, hero, target) {
  // TODO: generalize for other skills, including items.
  var skill = atb.Skill[skillId];
  var skillCost = skill[atb.Skill.field.cost];
  var skillCostSp = skillCost[1] ? skillCost[1] : 0;

  return (!hero.statuses.dead 
    && !target.statuses.dead 
    && hero.attributes.sp >= skillCostSp);
}

/**
 * Extracts the skill cost from the executing hero. Assumes hero meets 
 * prerequisites to execute skill.
 *
 * @return {array} the extracted costs, analogous to the cost field in the Skill
 *    record.
 */
atb.Skill.payCost = function(skillId, hero) {
  var skillCost = atb.Skill[skillId][atb.Skill.field.cost];
  var skillCostSp = skillCost[1] ? skillCost[1] : 0;

  hero.attributes.sp -= skillCostSp;
  return skillCostSp; 
}
