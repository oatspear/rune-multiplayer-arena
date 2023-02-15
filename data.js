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
    icon: "poison",
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
  },
  stun: {
    name: "Gouge",
    icon: "stun",
    description: "Stun an enemy."
  },
  stunAttack: {
    name: "Heavy Blow",
    icon: "stun",
    description: "Attack and Stun an enemy."
  },
  adrenaline: {
    name: "Adrenaline Rush",
    icon: "battle",
    description: "Power up."
  },
  quickAttack: {
    name: "Swift Strike",
    icon: "rogue",
    description: "Attack an enemy."
  },
  poisonArrow: {
    name: "Poison Arrow",
    icon: "poison-arrow",
    description: "Damage and Poison an enemy."
  },
  breakArmor: {
    name: "Break Armor",
    icon: "break-armor",
    description: "Enemy takes more damage."
  },
  divineProtection: {
    name: "Divine Protection",
    icon: "shield",
    description: "Shield all allies."
  },
  regrowth: {
    name: "Regrowth",
    icon: "heal",
    description: "Heal target over time."
  },
  massBarkskin: {
    name: "Mass Barkskin",
    icon: "shield",
    description: "+Armor to all allies."
  },
  fireBreath: {
    name: "Fire Breath",
    icon: "fire",
    description: "Damage all enemies."
  }
};


/*******************************************************************************
  Classes
*******************************************************************************/

const Classes = {
  ranger: {
    id: "ranger",
    name: "Ranger",
    icon: "ranger"
  },
  assassin: {
    id: "assassin",
    name: "Assassin",
    icon: "assassin"
  },
  rogue: {
    id: "rogue",
    name: "Rogue",
    icon: "rogue"
  },
  berserker: {
    id: "berserker",
    name: "Berserker",
    icon: "berserker"
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    icon: "paladin"
  },
  druid: {
    id: "druid",
    name: "Druid",
    icon: "mage"
  },
  boss: {
    id: "boss",
    name: "Boss",
    icon: "boss"
  },
  blackDragon: {
    id: "blackDragon",
    name: "Dragon",
    icon: "dragon-black"
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
  shield: {
    icon: "shield",
    animation: {
      icon: {
        name: "shield",
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
  fire: {
    icon: "fire",
    animation: {
      particles: {
        name: "fire",
        animation: "floating"
      }
    }
  },
  healOverTime: {
    icon: "heal",
    animation: {
      icon: {
        name: "heal",
        animation: "fading"
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
  },
  stun: {
    icon: "stun",
    animation: {
      icon: {
        name: "stun",
        animation: "floating"
      }
    }
  },
  buff: {
    icon: "battle",
    animation: {
      icon: {
        name: "battle",
        animation: "floating"
      }
    }
  },
  armor: {
    icon: "shield",
    animation: {
      icon: {
        name: "shield",
        animation: "shaking"
      }
    }
  }
};
