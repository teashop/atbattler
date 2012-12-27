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
