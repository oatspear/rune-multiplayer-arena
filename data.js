/*******************************************************************************
  Skills
*******************************************************************************/

function newSkill(id, name, speed, cooldown = 0, icon = "skill", description = "") {
  return {
    id: id,
    name: name,
    speed: speed,
    cooldown: cooldown,
    icon: icon,
    description: description
  };
}


const Skills = [
  newSkill(0, "Rest", 1, 0, "rest", "Recover some health."),
  newSkill(1, "Attack", 5, 0, "battle", "Attack an enemy."),
  newSkill(2, "Ranged Attack", 7, 0, "ranger", "Damage on enemy for [Power]."),
  newSkill(3, "Multi-Attack", 6, 0, "battle", "Damage all enemies for [Power]/2."),
  newSkill(0, "Rest", 1, 0, "rest", "Recover some health."),
  newSkill(0, "Rest", 1, 0, "rest", "Recover some health."),
  newSkill(0, "Rest", 1, 0, "rest", "Recover some health."),
  newSkill(0, "Rest", 1, 0, "rest", "Recover some health.")
];


function newSkillInstance(data) {
  return {
    data: data,
    cooldown: data.cooldown
  };
}


/*******************************************************************************
  Classes
*******************************************************************************/


function newCharacterClass(id, name, power = 0, health = 0) {
  return {
    id: id,
    name: name,
    power: power,
    health: health,
    skills: [1, 2, 3, 0],
  };
}


const Classes = {
  "": newCharacterClass("", ""),
  "ranger": newCharacterClass("ranger", "Ranger", 12, 20),
  "warrior": newCharacterClass("warrior", "Warrior", 10, 22),
  "rogue": newCharacterClass("rogue", "Rogue", 14, 18),
  "mage": newCharacterClass("mage", "Mage", 14, 18),
  "boss": newCharacterClass("boss", "Boss", 5, 30)
};


/*******************************************************************************
  Characters
*******************************************************************************/


function newCharacter(i, name, classId) {
  const cls = Classes[classId];
  const skills = [];
  for (let i = 0; i < cls.skills.length; ++i) {
    const data = Skills[cls.skills[i]];
    skills.push(newSkillInstance(data));
  }
  return {
    index: i,
    name: name,
    power: cls.power,
    health: cls.health,
    currentHealth: cls.health,
    characterClass: cls,
    skills: skills
  };
}


/*******************************************************************************
  Battles
*******************************************************************************/


function newRegion() {
  return [
    newCharacter(0, "Unnamed Boss", "boss"),
    newCharacter(1, "Unnamed Boss", "boss"),
    newCharacter(2, "Unnamed Boss", "boss"),
    newCharacter(3, "Unnamed Boss", "boss"),
  ];
}


function newPlayer(i, cls) {
  c = newCharacter(i, `Player ${i+1}`, cls)
  c.gold = (i+1)*2;
  return c;
}

const DummyCharacter = newCharacter(0, "", "");
