// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

// -----------------------------------------------------------------------------
// Utility
// -----------------------------------------------------------------------------


function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[rand];
    array[rand] = temp;
  }
  return array;
}


// -----------------------------------------------------------------------------
// Data Constants
// -----------------------------------------------------------------------------


export type GameMode = 0 | 1;


export const STATE_SETUP: GameMode = 0;
export const STATE_BATTLE: GameMode = 1;


export type TargetMode = 0 | 1 | 2 | 3 | 4 | 5;


export const TARGET_MODE_SELF: TargetMode = 0;
export const TARGET_MODE_ALLY: TargetMode = 1;
export const TARGET_MODE_ENEMY: TargetMode = 2;
export const TARGET_MODE_ALL_ALLIES: TargetMode = 3;
export const TARGET_MODE_ALL_ENEMIES: TargetMode = 4;
export const TARGET_MODE_ALL_CHARACTERS: TargetMode = 5;


export type EffectType = number;


const EFFECT_HEAL_TARGET_PERCENT: EffectType = 0;
const EFFECT_ATTACK_TARGET: EffectType = 1;
const EFFECT_DAMAGE_TARGET: EffectType = 2;
const EFFECT_HEAL_TARGET: EffectType = 3;
const EFFECT_ATTACK_POISON_TARGET: EffectType = 4;
const EFFECT_ATTACK_TARGET_BOOST_IF_POISONED: EffectType = 5;
const EFFECT_INVULNERABLE: EffectType = 6;
const EFFECT_STUN_TARGET: EffectType = 7;
const EFFECT_ATTACK_STUN_TARGET: EffectType = 8;
const EFFECT_BUFF_POWER: EffectType = 9;
const EFFECT_POISON_TARGET: EffectType = 10;
const EFFECT_DAMAGE_POISON_TARGET: EffectType = 11;
const EFFECT_ARMOR_MODIFIER: EffectType = 12;
const EFFECT_SHIELD_TARGET: EffectType = 13;
const EFFECT_HEAL_TARGET_OVER_TIME: EffectType = 14;
const EFFECT_CONSUME_HEAL_OVER_TIME: EffectType = 15;


// -----------------------------------------------------------------------------
// Skill Data
// -----------------------------------------------------------------------------


interface SkillData {
  id: string;
  cooldown: number;
  target: TargetMode;
  mechanic: EffectType;
}


interface SkillInstance {
  data: SkillData;
  cooldown: number;
  wait: number;
}


function newSkillInstance(data: SkillData): SkillInstance {
  return {
    data: data,
    // speed: data.speed,
    cooldown: data.cooldown,
    wait: data.cooldown
  };
}


function skillDataRest() {
  return {
    id: "rest",
    // speed: 1,
    cooldown: 0,
    target: TARGET_MODE_SELF,
    threat: -2,
    mechanic: EFFECT_HEAL_TARGET_PERCENT,
    healingPercent: 0.075
  };
}


function skillDataAttack() {
  return {
    id: "attack",
    // speed: 5,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 5,
    mechanic: EFFECT_ATTACK_TARGET
  };
}

function skillDataMockingAttack() {
  return {
    id: "mockAttack",
    // speed: 5,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 10,
    mechanic: EFFECT_ATTACK_TARGET
  };
}


function skillDataRangedAttack() {
  return {
    id: "rangedAttack",
    // speed: 7,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 6,
    mechanic: EFFECT_DAMAGE_TARGET,
    powerFactor: 1.5
  };
}


function skillDataSpellDamage() {
  return {
    id: "spellDamage",
    // speed: 7,
    cooldown: 3,
    target: TARGET_MODE_ENEMY,
    threat: 6,
    mechanic: EFFECT_DAMAGE_TARGET,
    powerFactor: 3
  };
}


function skillDataGreaterHeal() {
  return {
    id: "greaterHeal",
    // speed: 8,
    cooldown: 0,
    target: TARGET_MODE_ALLY,
    threat: 6,
    mechanic: EFFECT_HEAL_TARGET,
    powerFactor: 2.5
  };
}


function skillDataPoisonTarget() {
  return {
    id: "poison",
    // speed: 6,
    cooldown: 1,
    target: TARGET_MODE_ENEMY,
    threat: 4,
    mechanic: EFFECT_POISON_TARGET,
    powerFactor: 1
  };
}


function skillDataPoisonAttack() {
  return {
    id: "poisonAttack",
    // speed: 4,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 7,
    mechanic: EFFECT_ATTACK_POISON_TARGET,
    powerFactor: 1
  };
}


function skillDataPoisonArrow() {
  return {
    id: "poisonArrow",
    // speed: 7,
    cooldown: 1,
    target: TARGET_MODE_ENEMY,
    threat: 7,
    mechanic: EFFECT_DAMAGE_POISON_TARGET,
    powerFactor: 1
  };
}


function skillDataEnvenom() {
  return {
    id: "envenom",
    // speed: 7,
    cooldown: 2,
    target: TARGET_MODE_ENEMY,
    threat: 8,
    mechanic: EFFECT_ATTACK_TARGET_BOOST_IF_POISONED,
    powerFactor: 3
  };
}


function skillDataEvasion() {
  return {
    id: "evasion",
    // speed: 2,
    cooldown: 3,
    target: TARGET_MODE_SELF,
    threat: 4,
    mechanic: EFFECT_INVULNERABLE,
    duration: 1
  };
}


function skillDataStunTarget() {
  return {
    id: "stun",
    // speed: 4,
    cooldown: 2,
    target: TARGET_MODE_ENEMY,
    threat: 7,
    mechanic: EFFECT_STUN_TARGET,
    duration: 1
  };
}


function skillDataStunAttack() {
  return {
    id: "stunAttack",
    // speed: 8,
    cooldown: 5,
    target: TARGET_MODE_ENEMY,
    threat: 8,
    mechanic: EFFECT_ATTACK_STUN_TARGET,
    duration: 2
  };
}


function skillDataAdrenalineRush() {
  return {
    id: "adrenaline",
    // speed: 3,
    cooldown: 1,
    target: TARGET_MODE_SELF,
    threat: 3,
    mechanic: EFFECT_BUFF_POWER,
    value: 3
  };
}


function skillDataQuickAttack() {
  return {
    id: "quickAttack",
    // speed: 3,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 6,
    mechanic: EFFECT_ATTACK_TARGET
  };
}


function skillDataBreakArmor() {
  return {
    id: "breakArmor",
    // speed: 5,
    cooldown: 5,
    target: TARGET_MODE_ENEMY,
    threat: 7,
    mechanic: EFFECT_ARMOR_MODIFIER,
    duration: 3
  };
}


function skillDataDivineProtection() {
  return {
    id: "divineProtection",
    // speed: 10,
    cooldown: 3,
    target: TARGET_MODE_ALL_ALLIES,
    threat: 7,
    mechanic: EFFECT_SHIELD_TARGET,
    powerFactor: 2.5
  };
}


function skillDataRegrowth() {
  return {
    id: "regrowth",
    // speed: 6,
    cooldown: 2,
    target: TARGET_MODE_ALL_ALLIES,
    threat: 7,
    mechanic: EFFECT_HEAL_TARGET_OVER_TIME,
    powerFactor: 0.5
  };
}


function skillDataWildBlossom() {
  return {
    id: "wildBlossom",
    // speed: 10,
    cooldown: 5,
    target: TARGET_MODE_ALL_ALLIES,
    threat: 8,
    mechanic: EFFECT_CONSUME_HEAL_OVER_TIME,
    factor: 3
  };
}


function skillDataFireBreath() {
  return {
    id: "fireBreath",
    // speed: 10,
    cooldown: 3,
    target: TARGET_MODE_ALL_ENEMIES,
    threat: 8,
    mechanic: EFFECT_DAMAGE_TARGET,
    damageType: "fire",
    powerFactor: 2
  };
}


function skillDataPowerRitual() {
  return {
    id: "powerRitual",
    // speed: 10,
    cooldown: 3,
    target: TARGET_MODE_ALL_ALLIES,
    threat: 4,
    mechanic: EFFECT_BUFF_POWER,
    value: 2
  };
}


function skillDataPowerBoost() {
  return {
    id: "powerBoost",
    // speed: 3,
    cooldown: 2,
    target: TARGET_MODE_ALLY,
    threat: 3,
    mechanic: EFFECT_BUFF_POWER,
    value: 4
  };
}


function skillDataHealingWave() {
  return {
    id: "healingWave",
    // speed: 10,
    cooldown: 1,
    target: TARGET_MODE_ALL_ALLIES,
    threat: 7,
    mechanic: EFFECT_HEAL_TARGET,
    powerFactor: 1.5
  };
}


function skillDataBossEnrage() {
  return {
    id: "bossEnrage",
    // speed: 3,
    cooldown: 12,
    target: TARGET_MODE_SELF,
    threat: 3,
    mechanic: EFFECT_BUFF_POWER,
    value: 4
  };
}


// -----------------------------------------------------------------------------
// Class Data
// -----------------------------------------------------------------------------


function getClassById(id) {
  switch (id) {
    case "assassin":
      return classDataAssassin();

    case "rogue":
      return classDataRogue();

    case "berserker":
      return classDataBerserker();

    case "ranger":
      return classDataRanger();

    case "cleric":
      return classDataCleric();

    case "druid":
      return classDataDruid();

    default:
      throw Rune.invalidAction();
  }
}


function classDataDummy() {
  return {
    classId: null,
    power: 1,
    health: 1,
    speed: 1,
    skills: [
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataAssassin() {
  return {
    classId: "assassin",
    power: 12,
    health: 92,
    speed: 7,
    skills: [
      newSkillInstance(skillDataEnvenom()),
      newSkillInstance(skillDataPoisonAttack()),
      newSkillInstance(skillDataEvasion()),
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataRogue() {
  return {
    classId: "rogue",
    power: 12,
    health: 92,
    speed: 8,
    skills: [
      newSkillInstance(skillDataAdrenalineRush()),
      newSkillInstance(skillDataQuickAttack()),
      newSkillInstance(skillDataStunTarget()),
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataRanger() {
  return {
    classId: "ranger",
    power: 10,
    health: 92,
    speed: 6,
    skills: [
      newSkillInstance(skillDataPoisonArrow()),
      newSkillInstance(skillDataRangedAttack()),
      newSkillInstance(skillDataEvasion()),
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataBerserker() {
  return {
    classId: "berserker",
    power: 10,
    health: 100,
    speed: 5,
    skills: [
      newSkillInstance(skillDataStunAttack()),
      newSkillInstance(skillDataMockingAttack()),
      newSkillInstance(skillDataBreakArmor()),
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataCleric() {
  return {
    classId: "cleric",
    power: 6,
    health: 80,
    speed: 3,
    skills: [
      newSkillInstance(skillDataPowerBoost()),
      newSkillInstance(skillDataAttack()),
      newSkillInstance(skillDataDivineProtection()),
      newSkillInstance(skillDataGreaterHeal())
    ]
  };
}


function classDataDruid() {
  return {
    classId: "druid",
    power: 7,
    health: 80,
    speed: 4,
    skills: [
      newSkillInstance(skillDataRegrowth()),
      newSkillInstance(skillDataAttack()),
      newSkillInstance(skillDataWildBlossom()),
      newSkillInstance(skillDataGreaterHeal())
    ]
  };
}


function classDataShaman() {
  return {
    classId: "shaman",
    power: 6,
    health: 85,
    speed: 4,
    skills: [
      newSkillInstance(skillDataPowerRitual()),
      newSkillInstance(skillDataAttack()),
      newSkillInstance(skillDataSpellDamage()),
      newSkillInstance(skillDataHealingWave())
    ]
  };
}


function bossDataDummy() {
  return {
    classId: "boss",
    power: 10,
    health: 200,
    speed: 5,
    basicAttack: newSkillInstance(skillDataAttack()),
    rest: newSkillInstance(skillDataRest()),
    skills: []
  };
}


function bossDataBlackDragon() {
  return {
    classId: "blackDragon",
    power: 7,
    health: 300,
    speed: 5,
    basicAttack: newSkillInstance(skillDataAttack()),
    rest: newSkillInstance(skillDataRest()),
    skills: [
      newSkillInstance(skillDataBossEnrage()),
      newSkillInstance(skillDataFireBreath()),
      newSkillInstance(skillDataStunAttack()),
    ]
  };
}


function bossDataStormDragon() {
  return {
    classId: "stormDragon",
    power: 9,
    health: 250,
    speed: 5,
    basicAttack: newSkillInstance(skillDataAttack()),
    rest: newSkillInstance(skillDataRegrowth()),
    skills: [
      newSkillInstance(skillDataBossEnrage()),
      newSkillInstance(skillDataFireBreath()),
    ]
  };
}


function bossDataGargoyle() {
  return {
    classId: "gargoyle",
    power: 8,
    health: 200,
    speed: 5,
    basicAttack: newSkillInstance(skillDataPoisonAttack()),
    rest: newSkillInstance(skillDataRest()),
    skills: [
      newSkillInstance(skillDataPowerBoost()),
    ]
  };
}


// -----------------------------------------------------------------------------
// Player Character Data
// -----------------------------------------------------------------------------


function newCharacterEffectsMap() {
  // numbers are duration in turns
  return {
    shield: 0,  // damage
    poison: 0,  // damage
    healing: 0,  // damage
    invulnerable: 0,  // duration
    stunned: 0,  // duration
    healingModifier: 0,  // duration
    armorModifier: 0,  // duration
  };
}


function newPlayerCharacter(playerId, index, name) {
  const data = classDataDummy();
  data.id = index;
  data.index = index;
  // data.name = name;
  data.playerId = playerId;
  data.currentHealth = data.health;
  data.threat = 0;
  data.dead = false;
  data.effects = newCharacterEffectsMap();
  return data;
}


// -----------------------------------------------------------------------------
// Enemy Character Data
// -----------------------------------------------------------------------------


function newEnemyCharacter() {
  const options = shuffle([
    bossDataBlackDragon(),
    bossDataStormDragon(),
    bossDataGargoyle(),
  ]);
  const data = options.pop();
  data.id = -1;
  data.index = 0;
  data.currentHealth = data.health;
  data.effects = newCharacterEffectsMap();
  data.lastHealed = 0;
  data.lastSpecial = 0;
  return data;
}


function applyEnemyBoosts(enemy, numberOfPlayers) {
  while (--numberOfPlayers) {
    grantEnemyBoost(enemy);
  }
}


function grantEnemyBoost(enemy) {
  // enemy.power++;
  enemy.health += 100;
  enemy.currentHealth += 100;
}


function takeEnemyBoost(enemy) {
  // enemy.power--;
  if (enemy.health > 100) {
    enemy.health -= 100;
    if (enemy.currentHealth > enemy.health) {
      enemy.currentHealth = enemy.health;
    }
  }
}


// -----------------------------------------------------------------------------
// Battle Events
// -----------------------------------------------------------------------------


function newSkillBattleEvent(character, skill) {
  return {
    type: "skill",
    skill: skill.data.id,
    user: character.id
  };
}


function newCharacterDiedBattleEvent(character) {
  return {
    type: "died",
    character: character.id
  };
}


// -----------------------------------------------------------------------------
// Battle Logic
// -----------------------------------------------------------------------------


function processPlayerSkill(game, player, skill, args) {
  // Move the player down the queue
  // adjustTurnOrder(game, player.speed);
  // player.speed += skill.speed;

  // Clear the event queue
  game.events = [];

  if (player.effects.stunned <= 0) {
    // Resolve the skill
    resolveSkill(game, player, skill, args);

    // Determine if game has ended
    if (isGameOver(game)) {
      if (game.enemy.currentHealth <= 0) {
        Rune.gameOver(gameOverOptionsWon(game, false));
      } else {
        Rune.gameOver(gameOverOptionsLost(game, false));
      }
    }

    updateThreatLevel(game, player.index, skill.data.threat);
  }

  // Determine enemy reaction
  doEnemyReaction(game, player, skill);

  doEndOfTurnEffects(game);

  // Determine if game has ended
  if (isGameOver(game)) {
    if (game.enemy.currentHealth <= 0) {
      Rune.gameOver(gameOverOptionsWon(game, false));
    } else {
      Rune.gameOver(gameOverOptionsLost(game, false));
    }
  }

  advanceTurns(game);
}


function resolveSkill(game, user, skill, args) {
  const target = getTarget(game, user, skill.data.target, args.target);
  const event = newSkillBattleEvent(user, skill);
  game.events.push(event);

  // +1 to accomodate for tick at the end of the turn
  skill.wait = skill.cooldown + 1;

  switch (skill.data.mechanic) {
    case EFFECT_HEAL_TARGET_PERCENT:
      return handleHealTargetByPercent(game, user, target, skill);

    case EFFECT_ATTACK_TARGET:
      return handleAttackTarget(game, user, target, skill);

    case EFFECT_DAMAGE_TARGET:
      return handleDamageTargetByFactor(game, user, target, skill);

    case EFFECT_HEAL_TARGET:
      return handleHealTargetByFactor(game, user, target, skill);

    case EFFECT_ATTACK_POISON_TARGET:
      return handleAttackPoisonTarget(game, user, target, skill);

    case EFFECT_ATTACK_TARGET_BOOST_IF_POISONED:
      return handleAttackTargetBoostIfPoisoned(game, user, target, skill);

    case EFFECT_INVULNERABLE:
      return handleMakeTargetInvulnerable(game, user, target, skill);

    case EFFECT_STUN_TARGET:
      return handleStunTarget(game, user, target, skill);

    case EFFECT_ATTACK_STUN_TARGET:
      return handleAttackStunTarget(game, user, target, skill);

    case EFFECT_BUFF_POWER:
      return handlePowerBoostTarget(game, user, target, skill);

    case EFFECT_POISON_TARGET:
      return handlePoisonTarget(game, user, target, skill);

    case EFFECT_DAMAGE_POISON_TARGET:
      return handleDamagePoisonTarget(game, user, target, skill);

    case EFFECT_ARMOR_MODIFIER:
      return handleTargetArmorModifier(game, user, target, skill);

    case EFFECT_SHIELD_TARGET:
      return handleShieldTarget(game, user, target, skill);

    case EFFECT_HEAL_TARGET_OVER_TIME:
      return handleHealTargetOverTime(game, user, target, skill);

    case EFFECT_CONSUME_HEAL_OVER_TIME:
      return handleConsumeHealOverTime(game, user, target, skill);

    default:
      throw Rune.invalidAction();
  }
}


function getPlayer(game, playerId) {
  for (const player of game.players) {
    if (player.playerId === playerId) {
      return player;
    }
  }
}


function getTarget(game, user, targetMode, targetIndex) {
  if (!targetMode) {
    return user;
  }
  if (targetMode === TARGET_MODE_ALLY) {
    const character = user.playerId != null ? game.players[targetIndex] : user;
    if (character.currentHealth <= 0) {
      throw Rune.invalidAction();
    }
    return character;
  }
  if (targetMode === TARGET_MODE_ENEMY) {
    const character = user.playerId != null ? game.enemy : game.players[targetIndex];
    if (character.currentHealth <= 0) {
      throw Rune.invalidAction();
    }
    return character;
  }
  const targets = [];
  if (targetMode !== TARGET_MODE_ALL_ALLIES) {
    // all enemies or all characters
    if (user.playerId != null) {
      targets.push(game.enemy);
    } else {
      for (const character of game.players) {
        if (character.currentHealth > 0) {
          targets.push(character);
        }
      }
    }
  }
  if (targetMode !== TARGET_MODE_ALL_ENEMIES) {
    // all allies or all characters
    if (user.playerId != null) {
      for (const character of game.players) {
        if (character.currentHealth > 0) {
          targets.push(character);
        }
      }
    } else {
      targets.push(game.enemy);
    }
  }
  return targets;
}


function handleAttackTarget(game, user, target, skill) {
  const e = userAttackTarget(game, user, target);
  // FIXME
  game.events.push(e.action);
  game.events.push(e.reaction);
}


function handleAttackPoisonTarget(game, user, target, skill) {
  handleAttackTarget(game, user, target, skill);
  handlePoisonTarget(game, user, target, skill);
}


function handleDamagePoisonTarget(game, user, target, skill) {
  handleDamageTargetByFactor(game, user, target, skill);
  handlePoisonTarget(game, user, target, skill);
}


function handleAttackTargetBoostIfPoisoned(game, user, target, skill) {
  if (target.effects.poison > 0) {
    const power = user.power;
    user.power = (power * skill.data.powerFactor) | 0;
    handleAttackTarget(game, user, target, skill);
    user.power = power;
  } else {
    handleAttackTarget(game, user, target, skill);
  }
}


function handleAttackStunTarget(game, user, target, skill) {
  handleAttackTarget(game, user, target, skill);
  handleStunTarget(game, user, target, skill);
}


function handleDamageTargetByFactor(game, user, target, skill) {
  const damage = ((user.power * skill.data.powerFactor) | 0) || 1;
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = dealDamageToTarget(game, character, damage, skill.data.damageType);
    game.events.push(e);
  }
}


function handleHealTargetByPercent(game, user, target, skill) {
  const damage = ((target.health * skill.data.healingPercent) | 0) || 1;
  const e = healTarget(game, target, damage);
  game.events.push(e);
}


function handleHealTargetByFactor(game, user, target, skill) {
  const damage = ((user.power * skill.data.powerFactor) | 0) || 1;
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = healTarget(game, character, damage);
    game.events.push(e);
  }
}


function handleHealTargetOverTime(game, user, target, skill) {
  const damage = ((user.power * skill.data.powerFactor) | 0) || 1;
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = healTargetOverTime(game, character, damage);
    game.events.push(e);
  }
}


function handleConsumeHealOverTime(game, user, target, skill) {
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const damage = ((character.effects.healing * skill.data.factor) | 0) || 1;
    if (damage > 0) {
      character.effects.healing = 0;
      const e = healTarget(game, character, damage);
      game.events.push(e);
    }
  }
}


function handlePowerBoostTarget(game, user, target, skill) {
  const value = skill.data.value;
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = boostTargetPower(game, character, value);
    game.events.push(e);
  }
}


function handleShieldTarget(game, user, target, skill) {
  const damage = ((user.power * skill.data.powerFactor) | 0) || 1;
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = shieldTarget(game, character, damage);
    game.events.push(e);
  }
}


function handlePoisonTarget(game, user, target, skill) {
  const damage = ((user.power * 0.5) | 0) || 1;
  const e = poisonTarget(game, target, damage);
  game.events.push(e);
}


function handleStunTarget(game, user, target, skill) {
  const e = stunTarget(game, target, skill.data.duration);
  game.events.push(e);
}


function handleMakeTargetInvulnerable(game, user, target, skill) {
  const e = makeTargetInvulnerable(game, target, skill.data.duration);
  game.events.push(e);
}


function handleTargetArmorModifier(game, user, target, skill) {
  if (target.length == null) {
    target = [target];
  }
  for (const character of target) {
    const e = applyTargetArmorModifier(game, character, skill.data.duration);
    game.events.push(e);
  }
}


function userAttackTarget(game, user, target) {
  const action = dealDamageToTarget(game, target, user.power);
  const reaction = dealDamageToTarget(game, user, target.power);
  return {
    type: "attack",
    action: action,
    reaction: reaction
  };
}


function dealDamageToTarget(game, target, damage, type) {
  const hp = target.currentHealth;
  if (target.effects.invulnerable) {
    damage = 0;
  } else {
    if (target.effects.armorModifier > 0) {
      damage = (damage * 1.5) | 0;
    }
    const shield = target.effects.shield;
    if (shield >= damage) {
      target.effects.shield = shield - damage;
      damage = 0;
    } else {
      damage -= shield;
      target.effects.shield = 0;
      target.currentHealth -= damage;
      if (target.currentHealth <= 0 && target.playerId != null) {
        killPlayerCharacter(game, target);
      }
    }
  }
  return {
    type: type || "damage",
    target: target.id,
    value: damage,
    startingHealth: hp,
    finalHealth: target.currentHealth,
    finalShield: target.effects.shield
  };
}


function healTarget(game, target, damage) {
  const hp = target.currentHealth;
  if (target.effects.healingModifier > 0) {
    damage = (damage * 2 / 3) | 0;
  }
  if (damage < 0) {
    damage = 0;
  } else {
    target.currentHealth += damage;
    if (target.currentHealth > target.health) {
      target.currentHealth = target.health;
    }
  }
  return {
    type: "heal",
    target: target.id,
    value: damage,
    startingHealth: hp,
    finalHealth: target.currentHealth
  };
}


function boostTargetPower(game, target, value) {
  const old = target.power;
  target.power += value;
  return {
    type: "buff",
    target: target.id,
    startingPower: old,
    finalPower: target.power,
    value: value
  };
}


function shieldTarget(game, target, damage) {
  target.effects.shield += damage;
  return {
    type: "shield",
    target: target.id,
    value: damage
  };
}


function poisonTarget(game, target, damage) {
  target.effects.poison = damage;
  return {
    type: "poison",
    target: target.id,
    value: damage
  };
}


function healTargetOverTime(game, target, damage) {
  target.effects.healing = damage;
  return {
    type: "healOverTime",
    target: target.id,
    value: damage
  };
}


function stunTarget(game, target, duration) {
  target.effects.stunned = duration;
  return {
    type: "stun",
    target: target.id,
    value: duration
  }
}


function applyTargetArmorModifier(game, target, duration) {
  target.effects.armorModifier = duration;
  return {
    type: "armor",
    target: target.id,
    duration: duration
  };
}


function makeTargetInvulnerable(game, target, duration) {
  target.effects.invulnerable = duration;
  return {
    type: "invulnerable",
    target: target.id,
    value: duration
  }
}


function updateThreatLevel(game, index, value) {
  const quarter = (value / 4) | 0;
  let highest = game.players[game.enemyTarget].threat;
  for (const player of game.players) {
    if (player.index === index) {
      player.threat += value;
    } else {
      player.threat -= quarter;
    }
    if (player.threat < 0) {
      player.threat = 0;
    }
    // console.log("Player", player.index, "threat:", player.threat);
    if (player.threat >= highest) {
      highest = player.threat;
      game.enemyTarget = player.index;
    }
  }
}


// function adjustTurnOrder(game, value) {
//   let threshold = 1000000;
//   for (const player of game.players) {
//     const speed = player.speed - value;
//     player.speed = speed;
//     if (speed < threshold) {
//       game.currentTurn = player.id;
//       threshold = speed;
//     }
//   }
// }


function doEnemyReaction(game, player, usedSkill) {
  const enemy = game.enemy;

  if (enemy.effects.stunned || enemy.currentHealth <= 0) { return; }

  // Select a skill
  let skill = enemy.basicAttack;
  if (((enemy.currentHealth / enemy.health) <= 0.25) && ((game.turns - enemy.lastHealed) > 7)) {
    skill = enemy.rest;
    enemy.lastHealed = game.turns;
  } else {
    // if ((game.turns - enemy.lastSpecial) > 1)
    for (const special of enemy.skills) {
      if (special.wait <= 0) {
        skill = special;
        enemy.lastSpecial = game.turns;
        break;
      }
    }
  }

  // Resolve the skill
  resolveSkill(game, enemy, skill, { target: game.enemyTarget });

  // Determine if game has ended
  if (isGameOver(game)) {
    if (game.enemy.currentHealth <= 0) {
      Rune.gameOver(gameOverOptionsWon(game, false));
    } else {
      Rune.gameOver(gameOverOptionsLost(game, false));
    }
  }
}


function doEndOfTurnEffects(game) {
  doEndOfTurnEffectsForCharacter(game, game.enemy);
  for (const player of game.players) {
    doEndOfTurnEffectsForCharacter(game, player);
  }
}


function doEndOfTurnEffectsForCharacter(game, character) {
  const effects = character.effects;
  // shield: damage
  // poison: damage
  // healing: damage
  // invulnerable: duration
  // stunned: duration
  // healingModifier: duration,
  // armorModifier: duration,

  // apply healing over time effects
  let value = effects.healing;
  if (value > 0) {
    const e = healTarget(game, character, value);
    game.events.push(e);
  }

  // apply damage over time effects
  value = effects.poison;
  if (value > 0) {
    const e = dealDamageToTarget(game, character, value, "poisonDamage");
    game.events.push(e);
  }

  // update duration-based effects
  if (effects.invulnerable > 0) {
    effects.invulnerable--;
  }
  if (effects.stunned > 0) {
    effects.stunned--;
  }
  if (effects.armorModifier > 0) {
    effects.armorModifier--;
  }
  if (effects.healingModifier > 0) {
    effects.healingModifier--;
  }

  // update skill cooldowns
  for (const skill of character.skills) {
    if (skill.wait > 0) {
      skill.wait--;
    }
  }
}


function enterBattleState(game) {
  game.state = STATE_BATTLE;
  game.enemy = newEnemyCharacter();
  game.currentTurn = 0;
  game.events = [];
  game.enemyTarget = 0;
  // let speed = 1000000;
  // for (const character of game.players) {
  //   if (character.speed < speed) {
  //     game.currentTurn = character.id;
  //     speed = character.speed;
  //   }
  //   game.enemyTarget = character.index;
  // }
  applyEnemyBoosts(game.enemy, game.players.length)
}


function advanceTurns(game) {
  game.turns++;
  const t = game.currentTurn;
  const n = game.players.length;
  for (let i = 1; i <= n; ++i) {
    const k = (t + i) % n;
    if (game.players[k].currentHealth > 0) {
      game.currentTurn = k;
      break;
    }
  }
}


function killPlayerCharacter(game, player) {
  player.dead = true;
  player.currentHealth = 0;
  player.effects = newCharacterEffectsMap();
  updateThreatLevel(game, -1, 0);
  player.threat = -1;
}


function isGameOver(game) {
  if (game.enemy.currentHealth <= 0) {
    return true;
  }
  for (const player of game.players) {
    if (player.currentHealth > 0) {
      return false;
    }
  }
  return true;
}

function gameOverOptionsLost(game, delayPopUp) {
  return gameOverOptions(game, "LOST", delayPopUp);
}

function gameOverOptionsWon(game, delayPopUp) {
  return gameOverOptions(game, "WON", delayPopUp);
}

function gameOverOptions(game, result, delayPopUp) {
  let players = {};
  for (const player of game.players) {
    players[player.playerId] = result;
  }
  return {
    players: players,
    delayPopUp: (delayPopUp || false)
  };
}


// -----------------------------------------------------------------------------
// Rune Setup
// -----------------------------------------------------------------------------

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,

  setup(players) {
    // players: array of string IDs
    const game = {
      state: STATE_SETUP,
      enemy: null,
      players: [],
      currentTurn: null,
      events: [],
      enemyTarget: 0,
      availableHeroes: [],
      turns: 0
    };

    game.availableHeroes = shuffle([
      classDataAssassin(),
      // classDataRogue,
      classDataBerserker(),
      classDataRanger(),
      classDataCleric(),
      classDataDruid(),
      classDataShaman()
    ]);

    for (const playerId of players) {
      const player = newPlayerCharacter(playerId, game.players.length);
      const classData = game.availableHeroes.pop();
      Object.assign(player, classData);
      player.currentHealth = player.health;
      game.players.push(player);
    }

    enterBattleState(game);

    return game;
  },

  events: {
    playerJoined(playerId, { game }) {
      const player = newPlayerCharacter(playerId, game.players.length);
      const classData = game.availableHeroes.pop();
      Object.assign(player, classData);
      player.currentHealth = player.health;
      game.players.push(player);
      grantEnemyBoost(game.enemy);
    },

    playerLeft(playerId, { game }) {
      for (let i = game.players.length - 1; i >= 0; i--) {
        const player = game.players[i];
        if (player.playerId != playerId) { continue; }

        // Add the hero class back into the pool
        const classData = getClassById(player.classId);
        if (classData != null) { game.availableHeroes.push(classData); }

        // Kill the character
        killPlayerCharacter(game, player);

        // Determine if game has ended
        if (isGameOver(game)) {
          Rune.gameOver(gameOverOptionsLost(game, false));
        }

        // Remove the player from the game
        takeEnemyBoost(game.enemy);
        game.players.splice(i, 1);
        for (let j = i; j < game.players.length; ++j) {
          game.players[j].id = j;
          game.players[j].index = j;
        }


        // End the current turn if it belongs to this player
        if (game.currentTurn === player.id) {
          doEndOfTurnEffects(game);
          advanceTurns(game);
        }
      }
    }
  },

  actions: {
    // selectCharacter(payload, { game, playerId }) {
    //   if (game.state !== STATE_SETUP) {
    //     throw Rune.invalidAction();
    //   }

    //   // Get the corresponding player
    //   const player = getPlayer(game, playerId);
    //   if (player == null) {
    //     throw Rune.invalidAction();
    //   }

    //   // Get the selected class data
    //   const classData = getClassById(payload.classId);
    //   Object.assign(player, classData);

    //   // Check if everyone is ready
    //   for (const character of game.players) {
    //     if (!character.classId) { return; }
    //   }

    //   // Transition to battle state
    //   enterBattleState(game);
    // },

    useSkill(payload, { game, playerId }) {
      if (game.state !== STATE_BATTLE) {
        throw Rune.invalidAction();
      }

      // Check if it's the player's turn
      const player = getPlayer(game, playerId);
      if (player == null || game.currentTurn !== player.id) {
        throw Rune.invalidAction();
      }
      // Check if the selected skill can be used
      const skill = player.skills[payload.skill];
      if (skill == null || skill.wait > 0) {
        throw Rune.invalidAction();
      }
      processPlayerSkill(game, player, skill, payload);
    }
  },
});
