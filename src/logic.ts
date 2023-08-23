// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { RuneClient, GameOverOptions } from "rune-games-sdk/multiplayer";

// -----------------------------------------------------------------------------
// Utility
// -----------------------------------------------------------------------------


export type Maybe<T> = T | undefined;


export function assert(condition: boolean, message: string): void {
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


export type InternalGameState = 0 | 1;


export const STATE_SETUP: InternalGameState = 0;
export const STATE_BATTLE: InternalGameState = 1;


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
  threat: number;
  powerFactor?: number;
  healingPercent?: number;
  duration?: number;
  value?: number;
  factor?: number;
  damageType?: string;
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


function skillDataRest(): SkillData {
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


function skillDataAttack(): SkillData {
  return {
    id: "attack",
    // speed: 5,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 5,
    mechanic: EFFECT_ATTACK_TARGET
  };
}

function skillDataMockingAttack(): SkillData {
  return {
    id: "mockAttack",
    // speed: 5,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 10,
    mechanic: EFFECT_ATTACK_TARGET
  };
}


function skillDataRangedAttack(): SkillData {
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


function skillDataSpellDamage(): SkillData {
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


function skillDataGreaterHeal(): SkillData {
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


// function skillDataPoisonTarget(): SkillData {
//   return {
//     id: "poison",
//     // speed: 6,
//     cooldown: 1,
//     target: TARGET_MODE_ENEMY,
//     threat: 4,
//     mechanic: EFFECT_POISON_TARGET,
//     powerFactor: 1
//   };
// }


function skillDataPoisonAttack(): SkillData {
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


function skillDataPoisonArrow(): SkillData {
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


function skillDataEnvenom(): SkillData {
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


function skillDataEvasion(): SkillData {
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


function skillDataStunTarget(): SkillData {
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


function skillDataStunAttack(): SkillData {
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


function skillDataAdrenalineRush(): SkillData {
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


function skillDataQuickAttack(): SkillData {
  return {
    id: "quickAttack",
    // speed: 3,
    cooldown: 0,
    target: TARGET_MODE_ENEMY,
    threat: 6,
    mechanic: EFFECT_ATTACK_TARGET
  };
}


function skillDataBreakArmor(): SkillData {
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


function skillDataDivineProtection(): SkillData {
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


function skillDataRegrowth(): SkillData {
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


function skillDataWildBlossom(): SkillData {
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


function skillDataFireBreath(): SkillData {
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


function skillDataPowerRitual(): SkillData {
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


function skillDataPowerBoost(): SkillData {
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


function skillDataHealingWave(): SkillData {
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


function skillDataBossEnrage(): SkillData {
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


interface CharacterClassData {
  classId: string;
  power: number;
  health: number;
  speed: number;
  skills: SkillInstance[];
}



function getClassById(id: string): Maybe<CharacterClassData> {
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
  }
}


function classDataDummy(): CharacterClassData {
  return {
    classId: "",
    power: 1,
    health: 1,
    speed: 1,
    skills: [
      newSkillInstance(skillDataRest())
    ]
  };
}


function classDataAssassin(): CharacterClassData {
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


function classDataRogue(): CharacterClassData {
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


function classDataRanger(): CharacterClassData {
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


function classDataBerserker(): CharacterClassData {
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


function classDataCleric(): CharacterClassData {
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


function classDataDruid(): CharacterClassData {
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


function classDataShaman(): CharacterClassData {
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


interface BossClassData extends CharacterClassData {
  basicAttack: SkillInstance;
  rest: SkillInstance;
}


// function bossDataDummy(): BossClassData {
//   return {
//     classId: "boss",
//     power: 10,
//     health: 200,
//     speed: 5,
//     basicAttack: newSkillInstance(skillDataAttack()),
//     rest: newSkillInstance(skillDataRest()),
//     skills: []
//   };
// }


function bossDataBlackDragon(): BossClassData {
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


function bossDataStormDragon(): BossClassData {
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


function bossDataGargoyle(): BossClassData {
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


interface CharacterEffectsMap {
  shield: number;  // damage
  poison: number;  // damage
  healing: number;  // damage
  invulnerable: number;  // duration
  stunned: number;  // duration
  healingModifier: number;  // duration
  armorModifier: number;  // duration
}


function newCharacterEffectsMap(): CharacterEffectsMap {
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


interface CharacterInstance extends CharacterClassData {
  id: number;
  index: number;
  playerId: string;
  currentHealth: number;
  effects: CharacterEffectsMap;
}


interface PlayerCharacterInstance extends CharacterInstance {
  threat: number;
  dead: boolean;
}


function newPlayerCharacter(playerId: string, index: number): PlayerCharacterInstance {
  const data = classDataDummy() as PlayerCharacterInstance;
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


interface EnemyCharacterInstance extends CharacterInstance {
  basicAttack: SkillInstance;
  rest: SkillInstance;
  lastHealed: number;
  lastSpecial: number;
}



function newEnemyCharacter(): EnemyCharacterInstance {
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


function applyEnemyBoosts(enemy: EnemyCharacterInstance, numberOfPlayers: number): void {
  while (--numberOfPlayers) {
    grantEnemyBoost(enemy);
  }
}


function grantEnemyBoost(enemy: EnemyCharacterInstance): void {
  // enemy.power++;
  enemy.health += 100;
  enemy.currentHealth += 100;
}


function takeEnemyBoost(enemy: EnemyCharacterInstance): void {
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


interface BattleEvent {
  type: string;
}


interface SKillBattleEvent extends BattleEvent {
  skill: string;
  user: number;
}


function newSkillBattleEvent(character: CharacterInstance, skill: SkillInstance): SKillBattleEvent {
  return {
    type: "skill",
    skill: skill.data.id,
    user: character.id
  };
}


// interface DeathBattleEvent extends BattleEvent {
//   character: number;
// }


// function newCharacterDiedBattleEvent(character: CharacterInstance): DeathBattleEvent {
//   return {
//     type: "died",
//     character: character.id
//   };
// }


interface PlayerActionBattleEvent extends BattleEvent {
  action: BattleEvent;
  reaction: BattleEvent;
}


interface DamageBattleEvent extends BattleEvent {
  target: number;
  value: number;
  startingHealth: number;
  finalHealth: number;
  finalShield: number;
}


interface HealingBattleEvent extends BattleEvent {
  target: number;
  value: number;
  startingHealth: number;
  finalHealth: number;
}


interface PowerChangedBattleEvent extends BattleEvent {
  target: number;
  value: number;
  startingPower: number;
  finalPower: number;
}


interface ModifierChangedBattleEvent extends BattleEvent {
  target: number;
  value: number;
}


// -----------------------------------------------------------------------------
// Battle Logic
// -----------------------------------------------------------------------------


interface SkillActionParams {
  target: number;
}


interface UseSkillActionPayload extends SkillActionParams {
  skill: number;
}


function processPlayerSkill(game: GameState, player: PlayerCharacterInstance, skill: SkillInstance, args: SkillActionParams): void {
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


function resolveSkill(game: GameState, user: CharacterInstance, skill: SkillInstance, args: SkillActionParams): void {
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
  }
}


function getPlayer(game: GameState, playerId: string): Maybe<PlayerCharacterInstance> {
  for (const player of game.players) {
    if (player.playerId === playerId) {
      return player;
    }
  }
}


function getTarget(game: GameState, user: CharacterInstance, targetMode: TargetMode, targetIndex: number): CharacterInstance[] {
  if (!targetMode) {
    return [user];
  }
  if (targetMode === TARGET_MODE_ALLY) {
    const character = user.playerId != null ? game.players[targetIndex] : user;
    if (character.currentHealth <= 0) {
      // throw Rune.invalidAction();
      return [];
    }
    return [character];
  }
  if (targetMode === TARGET_MODE_ENEMY) {
    const character = user.playerId != null ? game.enemy : game.players[targetIndex];
    if (character.currentHealth <= 0) {
      // throw Rune.invalidAction();
      return [];
    }
    return [character];
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


function handleAttackTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], _skill: SkillInstance): void {
  for (const character of target) {
    const e = userAttackTarget(game, user, character);
    // FIXME
    game.events.push(e.action);
    game.events.push(e.reaction);
  }
}


function handleAttackPoisonTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  handleAttackTarget(game, user, target, skill);
  handlePoisonTarget(game, user, target, skill);
}


function handleDamagePoisonTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  handleDamageTargetByFactor(game, user, target, skill);
  handlePoisonTarget(game, user, target, skill);
}


function handleAttackTargetBoostIfPoisoned(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    if (character.effects.poison > 0) {
      const power = user.power;
      const factor = skill.data.powerFactor || 1;
      user.power = (power * factor) | 0;
      handleAttackTarget(game, user, target, skill);
      user.power = power;
    } else {
      handleAttackTarget(game, user, target, skill);
    }
  }
}


function handleAttackStunTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  handleAttackTarget(game, user, target, skill);
  handleStunTarget(game, user, target, skill);
}


function handleDamageTargetByFactor(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  const factor = skill.data.powerFactor || 1;
  const damage = ((user.power * factor) | 0) || 1;
  for (const character of target) {
    const e = dealDamageToTarget(game, character, damage, skill.data.damageType);
    game.events.push(e);
  }
}


function handleHealTargetByPercent(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    const percent = skill.data.healingPercent || 0;
    const damage = ((character.health * percent) | 0) || 1;
    const e = healTarget(game, character, damage);
    game.events.push(e);
  }
}


function handleHealTargetByFactor(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  const factor = skill.data.powerFactor || 1;
  const damage = ((user.power * factor) | 0) || 1;
  for (const character of target) {
    const e = healTarget(game, character, damage);
    game.events.push(e);
  }
}


function handleHealTargetOverTime(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  const factor = skill.data.powerFactor || 1;
  const damage = ((user.power * factor) | 0) || 1;
  for (const character of target) {
    const e = healTargetOverTime(game, character, damage);
    game.events.push(e);
  }
}


function handleConsumeHealOverTime(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    const factor = skill.data.factor || 1;
    const damage = ((character.effects.healing * factor) | 0) || 1;
    if (damage > 0) {
      character.effects.healing = 0;
      const e = healTarget(game, character, damage);
      game.events.push(e);
    }
  }
}


function handlePowerBoostTarget(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  const value = skill.data.value || 0;
  for (const character of target) {
    const e = boostTargetPower(game, character, value);
    game.events.push(e);
  }
}


function handleShieldTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  const factor = skill.data.powerFactor || 1;
  const damage = ((user.power * factor) | 0) || 1;
  for (const character of target) {
    const e = shieldTarget(game, character, damage);
    game.events.push(e);
  }
}


function handlePoisonTarget(game: GameState, user: CharacterInstance, target: CharacterInstance[], _skill: SkillInstance): void {
  const damage = ((user.power * 0.5) | 0) || 1;
  for (const character of target) {
    const e = poisonTarget(game, character, damage);
    game.events.push(e);
  }
}


function handleStunTarget(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    const e = stunTarget(game, character, skill.data.duration);
    game.events.push(e);
  }
}


function handleMakeTargetInvulnerable(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    const e = makeTargetInvulnerable(game, character, skill.data.duration);
    game.events.push(e);
  }
}


function handleTargetArmorModifier(game: GameState, _user: CharacterInstance, target: CharacterInstance[], skill: SkillInstance): void {
  for (const character of target) {
    const e = applyTargetArmorModifier(game, character, skill.data.duration);
    game.events.push(e);
  }
}


function userAttackTarget(game: GameState, user: CharacterInstance, target: CharacterInstance): PlayerActionBattleEvent {
  const action = dealDamageToTarget(game, target, user.power);
  const reaction = dealDamageToTarget(game, user, target.power);
  return {
    type: "attack",
    action: action,
    reaction: reaction
  };
}


function dealDamageToTarget(game: GameState, target: CharacterInstance, damage: number, type: string = "damage"): DamageBattleEvent {
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
        killPlayerCharacter(game, target as PlayerCharacterInstance);
      }
    }
  }
  return {
    type: type || "damage",
    target: target.id,
    value: damage,
    startingHealth: hp,
    finalHealth: target.currentHealth,
    finalShield: target.effects.shield,
  };
}


function healTarget(_game: GameState, target: CharacterInstance, damage: number): HealingBattleEvent {
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


function boostTargetPower(_game: GameState, target: CharacterInstance, value: number): PowerChangedBattleEvent {
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


function shieldTarget(_game: GameState, target: CharacterInstance, damage: number): ModifierChangedBattleEvent {
  target.effects.shield += damage;
  return {
    type: "shield",
    target: target.id,
    value: damage
  };
}


function poisonTarget(_game: GameState, target: CharacterInstance, damage: number): ModifierChangedBattleEvent {
  target.effects.poison = damage;
  return {
    type: "poison",
    target: target.id,
    value: damage
  };
}


function healTargetOverTime(_game: GameState, target: CharacterInstance, damage: number): ModifierChangedBattleEvent {
  target.effects.healing = damage;
  return {
    type: "healOverTime",
    target: target.id,
    value: damage
  };
}


function stunTarget(_game: GameState, target: CharacterInstance, duration: number = 1): ModifierChangedBattleEvent {
  target.effects.stunned = duration;
  return {
    type: "stun",
    target: target.id,
    value: duration
  }
}


function applyTargetArmorModifier(_game: GameState, target: CharacterInstance, duration: number = 1): ModifierChangedBattleEvent {
  target.effects.armorModifier = duration;
  return {
    type: "armor",
    target: target.id,
    value: duration
  };
}


function makeTargetInvulnerable(_game: GameState, target: CharacterInstance, duration: number = 1): ModifierChangedBattleEvent {
  target.effects.invulnerable = duration;
  return {
    type: "invulnerable",
    target: target.id,
    value: duration
  }
}


function updateThreatLevel(game: GameState, index: number, value: number): void {
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


function doEnemyReaction(game: GameState, _player: PlayerCharacterInstance, _usedSkill: SkillInstance): void {
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


function doEndOfTurnEffects(game: GameState): void {
  doEndOfTurnEffectsForCharacter(game, game.enemy);
  for (const player of game.players) {
    doEndOfTurnEffectsForCharacter(game, player);
  }
}


function doEndOfTurnEffectsForCharacter(game: GameState, character: CharacterInstance): void {
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


function enterBattleState(game: GameState): void {
  game.state = STATE_BATTLE;
  // game.enemy = newEnemyCharacter();
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


function advanceTurns(game: GameState): void {
  game.turns++;
  const t = game.currentTurn || 0;
  const n = game.players.length;
  for (let i = 1; i <= n; ++i) {
    const k = (t + i) % n;
    if (game.players[k].currentHealth > 0) {
      game.currentTurn = k;
      break;
    }
  }
}


function killPlayerCharacter(game: GameState, player: PlayerCharacterInstance): void {
  player.dead = true;
  player.currentHealth = 0;
  player.effects = newCharacterEffectsMap();
  updateThreatLevel(game, -1, 0);
  player.threat = -1;
}


function isGameOver(game: GameState): boolean {
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


function gameOverOptionsLost(game: GameState, delayPopUp: boolean): GameOverOptions {
  return gameOverOptions(game, "LOST", delayPopUp);
}


function gameOverOptionsWon(game: GameState, delayPopUp: boolean): GameOverOptions {
  return gameOverOptions(game, "WON", delayPopUp);
}


function gameOverOptions(game: GameState, result: "WON" | "LOST", delayPopUp: boolean): GameOverOptions {
  const players: {[playerId: string]: "WON" | "LOST"} = {};
  for (const player of game.players) {
    players[player.playerId] = result;
  }
  return {
    players: players,
    delayPopUp: (delayPopUp || false),
  };
}


// -----------------------------------------------------------------------------
// Game State
// -----------------------------------------------------------------------------


export interface GameState {
  state: InternalGameState;
  enemy: EnemyCharacterInstance;
  players: PlayerCharacterInstance[];
  currentTurn: number | null;
  events: BattleEvent[];
  enemyTarget: number;
  availableHeroes: CharacterClassData[];
  turns: number;
}


// -----------------------------------------------------------------------------
// Rune Setup
// -----------------------------------------------------------------------------


declare global {
  const Rune: RuneClient<GameState, GameActions>;
}


type GameActions = {
  useSkill: (params: UseSkillActionPayload) => void;
}



Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,

  setup(allPlayerIds: string[]): GameState {
    // players: array of string IDs
    const game: GameState = {
      state: STATE_SETUP,
      enemy: newEnemyCharacter(),
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

    for (const playerId of allPlayerIds) {
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
    playerJoined(playerId: Maybe<string>, { game }): void {
      if (!playerId) { return; }
      const player = newPlayerCharacter(playerId, game.players.length);
      const classData = game.availableHeroes.pop();
      Object.assign(player, classData);
      player.currentHealth = player.health;
      game.players.push(player);
      grantEnemyBoost(game.enemy);
    },

    playerLeft(playerId: Maybe<string>, { game }): void {
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

    useSkill(payload: UseSkillActionPayload, { game, playerId }): void {
      if (game.state !== STATE_BATTLE) {
        // throw Rune.invalidAction();
        return;
      }

      // Check if it's the player's turn
      const player = getPlayer(game, playerId);
      if (player == null || game.currentTurn !== player.id) {
        // throw Rune.invalidAction();
        return;
      }

      // Check if the selected skill can be used
      const skill = player.skills[payload.skill];
      if (skill == null || skill.wait > 0) {
        // throw Rune.invalidAction();
        return;
      }

      processPlayerSkill(game, player, skill, payload);
    }
  },
});
