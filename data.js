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

const Skills = {
  rest: {
    name: "Rest",
    icon: "rest",
    description: "Recover some health."
  },
  attack: {
    name: "Attack",
    icon: "battle",
    description: "Attack an enemy."
  },
  rangedAttack: {
    name: "Ranged Attack",
    icon: "ranger",
    description: "Deal damage to an enemy."
  },
  greaterHeal: {
    name: "Greater Heal",
    icon: "heal",
    description: "Heal an ally."
  },
  poisonAttack: {
    name: "Poison Strike",
    icon: "battle",
    description: "Attack and Poison an enemy."
  },
  envenom: {
    name: "Envenom",
    icon: "battle",
    description: "Attack an enemy. Bonus damage if poisoned."
  },
  evasion: {
    name: "Evasion",
    icon: "evasion",
    description: "Avoid enemy attacks."
  }
};


/*******************************************************************************
  Classes
*******************************************************************************/

const Classes = {
  ranger: {
    id: "ranger",
    name: "Ranger",
    icon: "ranger",
    power: 10,
    health: 20,
    skills: ["attack", "rangedAttack", "greaterHeal", "rest"],
  },
  rogue: {
    id: "rogue",
    name: "Rogue",
    icon: "rogue",
    power: 12,
    health: 100,
    skills: ["rest"]
  },
  boss: {
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
  attack: {
    icon: "battle",
    animation: {

    }
  },
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
  },
  poison: {
    icon: "skull-green",
    animation: {
      particles: {
        name: "skull-green",
        animation: "floating"
      }
    }
  },
  poisonDamage: {
    icon: "skull-green",
    animation: {
      particles: {
        name: "skull-green",
        animation: "floating"
      }
    }
  },
  invulnerable: {
    icon: "invulnerable",
    animation: {
      icon: {
        name: "invulnerable",
        animation: "fading"
      }
    }
  }
};
