// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Utility
*******************************************************************************/


// function newEnum(keys) {
//   const enumObject = {};
//   for (let i = 0; i < keys.length; ++i) {
//     enumObject[keys[i]] = i;
//   }
//   return Object.freeze(enumObject);
// }


// function checkProperty(obj, prop, type) {
//   assert(
//     (obj[prop] != null) && (typeof obj[prop] === type),
//     `expected property "${prop}" of type ${type} in ${obj}`
//   );
// }


/*******************************************************************************
  Constants
*******************************************************************************/

// const TargetMode = newEnum([
//   "SELF",
//   "ALLY",
//   "ENEMY",
//   "ALL_ALLIES",
//   "ALL_ENEMIES",
//   "ALL_CHARACTERS"
// ]);


// const SkillMechanics = newEnum([
//   "ATTACK_TARGETS",
//   "DAMAGE_TARGETS",
//   "HEAL_TARGETS"
// ]);


/*******************************************************************************
  Skills
*******************************************************************************/

// const SkillMetadata = {
//   "rest": {
//     name: "Rest",
//     icon: "rest",
//     description: "Recover some health."
//   },
//   "attack": {
//     name: "Attack",
//     icon: "battle",
//     description: "Attack an enemy."
//   },
//   "rangedAttack": {
//     name: "Ranged Attack",
//     icon: "ranger",
//     description: "Deal damage to an enemy."
//   },
//   "greaterHeal": {
//     name: "Greater Heal",
//     icon: "battle",
//     description: "Heal an ally."
//   }
// };

const Skills = {
  "rest": {
    name: "Rest",
    icon: "rest",
    speed: 1,
    cooldown: 0,
    target: targetModeSelf(),
    description: "Recover some health."
  },
  "attack": {
    name: "Attack",
    icon: "battle",
    speed: 5,
    cooldown: 0,
    target: targetModeEnemy(),
    description: "Attack an enemy."
  },
  "rangedAttack": {
    name: "Ranged Attack",
    icon: "ranger",
    speed: 7,
    cooldown: 0,
    target: targetModeEnemy(),
    description: "Deal damage to an enemy."
  },
  "greaterHeal": {
    name: "Greater Heal",
    icon: "heal",
    speed: 8,
    cooldown: 0,
    target: targetModeAlly(),
    description: "Heal an ally."
  }
};


/*******************************************************************************
  Classes
*******************************************************************************/

// const ClassMetadata = {
//   "ranger": {
//     id: "ranger",
//     name: "Ranger",
//     icon: "ranger"
//   }
// };

const Classes = {
  "ranger": {
    id: "ranger",
    name: "Ranger",
    icon: "ranger",
    power: 10,
    health: 20,
    skills: ["attack", "rangedAttack", "greaterHeal", "rest"],
  },
  "boss": {
    id: "boss",
    name: "Unnamed Boss",
    icon: "boss",
    power: 8,
    health: 200,
    skills: ["rest"]
  }
};


/*******************************************************************************
  Events
*******************************************************************************/

const BattleEvents = {
  damage: {
    icon: "damage",
    animation: {
      icon: {
        name: "damage",
        animation: "shaking"
      }
    }
  },
  heal: {
    icon: "healing",
    animation: {
      particles: {
        name: "healing",
        animation: "floating"
      }
    }
  }
};
