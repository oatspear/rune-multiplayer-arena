// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Utility
*******************************************************************************/


function newEnum(keys) {
  const enumObject = {};
  for (let i = 0; i < keys.length; ++i) {
    enumObject[keys[i]] = i;
  }
  return Object.freeze(enumObject);
}


function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


function checkProperty(obj, prop, type) {
  assert(
    (obj[prop] != null) && (typeof obj[prop] === type),
    `expected property "${prop}" of type ${type} in ${obj}`
  );
}


/*******************************************************************************
  Constants
*******************************************************************************/

const TargetMode = newEnum([
  "SELF",
  "ALLY",
  "ENEMY",
  "ALL_ALLIES",
  "ALL_ENEMIES",
  "ALL_CHARACTERS"
]);


const SkillMechanics = newEnum([
  "ATTACK_TARGETS",
  "DAMAGE_TARGETS",
  "HEAL_TARGETS"
]);


/*******************************************************************************
  Skills
*******************************************************************************/

const Skills = [];

function addSkill(params) {
  checkProperty(params, "name", "string");
  checkProperty(params, "speed", "number");
  const target = params.target;
  if (target != null) {
    assert(
      target === TargetMode.SELF
      || target === TargetMode.ALLY
      || target === TargetMode.ENEMY
      || target === TargetMode.ALL_ALLIES
      || target === TargetMode.ALL_ENEMIES
      || target === TargetMode.ALL_CHARACTERS
    );
  }
  const data = {
    id: Skills.length,
    name: params.name,
    speed: params.speed,
    cooldown: params.cooldown || 0,
    target: target || TargetMode.SELF,
    icon: params.icon || "skill",
    description: params.description || "No description."
  };
  Skills.push(data);
}


addSkill({
  name: "Rest",
  speed: 1,
  cooldown: 0,
  target: TargetMode.SELF,
  icon: "rest",
  description: "Recover some health."
});

addSkill({
  name: "Attack",
  speed: 5,
  target: TargetMode.ENEMY,
  icon: "battle",
  description: "Attack an enemy."
});

addSkill({
  name: "Ranged Attack",
  speed: 7,
  target: TargetMode.ENEMY,
  icon: "ranger",
  description: "Damage on enemy for [Power]."
});

addSkill({
  name: "Multi-Attack",
  speed: 6,
  target: TargetMode.ALL_ENEMIES,
  icon: "battle",
  description: "Damage all enemies for [Power]/2."
});

addSkill({
  name: "Rest",
  speed: 1,
  cooldown: 0,
  target: TargetMode.SELF,
  icon: "rest",
  description: "Recover some health."
});


function newSkillInstance(data) {
  return {
    data: data,
    speed: data.speed,
    cooldown: data.cooldown,
    wait: data.cooldown
  };
}


/*******************************************************************************
  Classes
*******************************************************************************/

const Classes = [];


function addCharacterClass(params) {
  checkProperty(params, "name", "string");
  checkProperty(params, "power", "number");
  checkProperty(params, "health", "number");
  checkProperty(params, "skills", "object");
  const data = {
    id: Classes.length,
    name: params.name,
    icon: params.icon || "berserker",
    power: params.power,
    health: params.health,
    skills: params.skills,
  };
  Classes.push(data);
}


addCharacterClass({
  name: "",
  icon: "",
  power: 0,
  health: 0,
  skills: [0]
});

addCharacterClass({
  name: "Ranger",
  icon: "ranger",
  power: 12,
  health: 20,
  skills: [1, 2, 3, 0]
});

addCharacterClass({
  name: "Warrior",
  icon: "warrior",
  power: 10,
  health: 22,
  skills: [1, 2, 3, 0]
});

addCharacterClass({
  name: "Rogue",
  icon: "rogue",
  power: 14,
  health: 18,
  skills: [1, 2, 3, 0]
});

addCharacterClass({
  name: "Mage",
  icon: "mage",
  power: 14,
  health: 18,
  skills: [1, 2, 3, 0]
});

addCharacterClass({
  name: "Boss",
  icon: "boss",
  power: 5,
  health: 30,
  skills: [1, 2, 3, 0]
});


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
    newCharacter(0, "Unnamed Boss", 5),
    newCharacter(1, "Unnamed Boss", 5),
    newCharacter(2, "Unnamed Boss", 5),
    newCharacter(3, "Unnamed Boss", 5),
  ];
}


function newPlayer(i, cls) {
  c = newCharacter(i, `Player ${i+1}`, cls)
  c.gold = (i+1)*2;
  return c;
}

const DummyCharacter = newCharacter(0, "", 0);
