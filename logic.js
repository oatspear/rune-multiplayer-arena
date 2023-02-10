// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Utility
*******************************************************************************/


function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


/*******************************************************************************
  Data Constants
*******************************************************************************/

function targetModeSelf() { return 0; }
function targetModeAlly() { return 1; }
function targetModeEnemy() { return 2; }
function targetModeAllAllies() { return 3; }
function targetModeAllEnemies() { return 4; }
function targetModeAllCharacters() { return 5; }

function constHealTargetPercent () { return 0; }
function constAttackTarget() { return 1; }
function constDamageTarget() { return 2; }
function constHealTarget() { return 3; }
function constAttackPoisonTarget() { return 4; }
function constAttackTargetBoostIfPoisoned() { return 5; }
function constInvulnerability() { return 6; }
function constStunTarget() { return 7; }
function constAttackStunTarget() { return 8; }
function constPowerBoost() { return 9; }


/*******************************************************************************
  Skill Data
*******************************************************************************/


function newSkillInstance(data) {
  return {
    data: data,
    speed: data.speed,
    cooldown: data.cooldown,
    wait: data.cooldown
  };
}


function skillDataRest() {
  return {
    id: "rest",
    speed: 1,
    cooldown: 0,
    target: targetModeSelf(),
    threat: -2,
    mechanic: constHealTargetPercent(),
    healingPercent: 0.1
  };
}


function skillDataAttack() {
  return {
    id: "attack",
    speed: 5,
    cooldown: 0,
    target: targetModeEnemy(),
    threat: 10,
    mechanic: constAttackTarget()
  };
}


function skillDataRangedAttack() {
  return {
    id: "rangedAttack",
    speed: 7,
    cooldown: 0,
    target: targetModeEnemy(),
    threat: 6,
    mechanic: constDamageTarget(),
    powerFactor: 1.5
  };
}


function skillDataGreaterHeal() {
  return {
    id: "greaterHeal",
    speed: 8,
    cooldown: 0,
    target: targetModeAlly(),
    threat: 6,
    mechanic: constHealTarget(),
    powerFactor: 2
  };
}


function skillDataPoisonAttack() {
  return {
    id: "poisonAttack",
    speed: 4,
    cooldown: 0,
    target: targetModeEnemy(),
    threat: 7,
    mechanic: constAttackPoisonTarget(),
    powerFactor: 1
  };
}


function skillDataEnvenom() {
  return {
    id: "envenom",
    speed: 7,
    cooldown: 2,
    target: targetModeEnemy(),
    threat: 8,
    mechanic: constAttackTargetBoostIfPoisoned(),
    powerFactor: 3
  };
}


function skillDataEvasion() {
  return {
    id: "evasion",
    speed: 2,
    cooldown: 3,
    target: targetModeSelf(),
    threat: 4,
    mechanic: constInvulnerability(),
    duration: 1
  };
}


function skillDataStunTarget() {
  return {
    id: "stun",
    speed: 4,
    cooldown: 2,
    target: targetModeEnemy(),
    threat: 7,
    mechanic: constStunTarget(),
    duration: 1
  };
}


function skillDataStunAttack() {
  return {
    id: "stunAttack",
    speed: 8,
    cooldown: 3,
    target: targetModeEnemy(),
    threat: 8,
    mechanic: constAttackStunTarget(),
    duration: 1
  };
}


function skillDataAdrenalineRush() {
  return {
    id: "adrenaline",
    speed: 3,
    cooldown: 2,
    target: targetModeSelf(),
    threat: 3,
    mechanic: constPowerBoost(),
    value: 2
  };
}


function skillDataQuickAttack() {
  return {
    id: "quickAttack",
    speed: 3,
    cooldown: 0,
    target: targetModeEnemy(),
    threat: 6,
    mechanic: constAttackTarget()
  };
}


/*******************************************************************************
  Class Data
*******************************************************************************/


function classDataAssassin() {
  return {
    classId: "assassin",
    power: 12,
    health: 92,
    speed: 4,
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
    speed: 4,
    skills: [
      newSkillInstance(skillDataAdrenalineRush()),
      newSkillInstance(skillDataQuickAttack()),
      newSkillInstance(skillDataStunTarget()),
      newSkillInstance(skillDataRest())
    ]
  };
}


function bossDataDummy() {
  return {
    classId: "boss",
    power: 10,
    health: 200,
    speed: 5,
    skills: [
      newSkillInstance(skillDataAttack()),
      newSkillInstance(skillDataRest())
    ]
  };
}


/*******************************************************************************
  Player Character Data
*******************************************************************************/


function newCharacterEffectsMap() {
  // numbers are duration in turns
  return {
    shield: 0,  // damage
    poison: 0,  // damage
    healing: 0,  // damage
    invulnerable: 0,  // duration
    stunned: 0,  // duration
    healingModifier: 0,
    damageModifier: 0,
  };
}


function newPlayerCharacter(playerId, index, name) {
  const data = classDataRogue();
  data.id = index;
  data.index = index;
  data.name = name;
  data.playerId = playerId;
  data.currentHealth = data.health;
  data.threat = 0;
  data.effects = newCharacterEffectsMap();
  return data;
}


/*******************************************************************************
  Enemy Character Data
*******************************************************************************/


function newEnemyCharacter() {
  const data = bossDataDummy();
  data.id = -1;
  data.index = 0;
  data.currentHealth = data.health;
  data.effects = newCharacterEffectsMap();
  return data;
}


/*******************************************************************************
  Battle Events
*******************************************************************************/


function newSkillBattleEvent(character, skill) {
  return {
    type: "skill",
    skill: skill.data.id,
    user: character.id
  };
}


/*******************************************************************************
  Battle Logic
*******************************************************************************/


function processPlayerSkill(game, player, skill, args) {
  // Move the player down the queue
  adjustTurnOrder(game, player.speed);
  player.speed += skill.speed;

  // Clear the event queue
  game.events = [];

  // Resolve the skill
  // console.log(playerId, "used a skill:", skill.data.id, args.target);
  resolveSkill(game, player, skill, args);
  updateThreatLevel(game, player.index, skill.data.threat);

  // Determine enemy reaction
  doEnemyReaction(game, player, skill);

  doEndOfTurnEffects(game);
  // console.log("game state:", game);
}


function resolveSkill(game, user, skill, args) {
  const target = getTarget(game, user, skill.data.target, args.target);
  const event = newSkillBattleEvent(user, skill);
  game.events.push(event);

  // +1 to accomodate for tick at the end of the turn
  skill.wait = skill.cooldown + 1;

  switch (skill.data.mechanic) {
    case constHealTargetPercent():
      return handleHealTargetByPercent(game, user, target, skill);

    case constAttackTarget():
      return handleAttackTarget(game, user, target, skill);

    case constDamageTarget():
      return handleDamageTargetByFactor(game, user, target, skill);

    case constHealTarget():
      return handleHealTargetByFactor(game, user, target, skill);

    case constAttackPoisonTarget():
      return handleAttackPoisonTarget(game, user, target, skill);

    case constAttackTargetBoostIfPoisoned():
      return handleAttackTargetBoostIfPoisoned(game, user, target, skill);

    case constInvulnerability():
      return handleMakeTargetInvulnerable(game, user, target, skill);

    case constStunTarget():
      return handleStunTarget(game, user, target, skill);

    case constAttackStunTarget():
      return handleAttackStunTarget(game, user, target, skill);

    case constPowerBoost():
      return handlePowerBoostTarget(game, user, target, skill);

    default:
      throw Rune.invalidAction();
  }

  // Determine if game has ended
  if (isGameOver(game)) {
    Rune.gameOver();
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
  if (targetMode === targetModeAlly()) {
    return user.playerId != null ? game.players[targetIndex] : user;
  }
  if (targetMode === targetModeEnemy()) {
    return user.playerId != null ? game.enemy : game.players[targetIndex];
  }
  const targets = [];
  if (targetMode !== targetModeAllAllies()) {
    // all enemies or all characters
    if (user.playerId != null) {
      targets.push(game.enemy);
    } else {
      targets.push.apply(targets, game.players);
    }
  }
  if (targetMode !== targetModeAllEnemies()) {
    // all allies or all characters
    if (user.playerId != null) {
      targets.push.apply(targets, game.players);
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
  const e = dealDamageToTarget(game, target, damage);
  game.events.push(e);
}


function handleHealTargetByPercent(game, user, target, skill) {
  const damage = ((target.health * skill.data.healingPercent) | 0) || 1;
  const e = healTarget(game, target, damage);
  game.events.push(e);
}


function handleHealTargetByFactor(game, user, target, skill) {
  const damage = ((user.power * skill.data.powerFactor) | 0) || 1;
  const e = healTarget(game, target, damage);
  game.events.push(e);
}


function handlePowerBoostTarget(game, user, target, skill) {
  const e = boostTargetPower(game, target, skill.data.value);
  game.events.push(e);
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
    const shield = target.effects.shield;
    if (shield >= damage) {
      damage = 0;
      target.effects.shield = shield - damage;
    } else {
      damage -= shield;
      target.effects.shield = 0;
    }
    target.currentHealth -= damage;
  }
  return {
    type: type || "damage",
    target: target.id,
    value: damage,
    startingHealth: hp,
    finalHealth: target.currentHealth
  };
}


function healTarget(game, target, damage) {
  const hp = target.currentHealth;
  target.currentHealth += damage;
  if (target.currentHealth > target.health) {
    target.currentHealth = target.health;
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


function poisonTarget(game, target, damage) {
  target.effects.poison = damage;
  return {
    type: "poison",
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


function makeTargetInvulnerable(game, target, duration) {
  target.effects.invulnerable = duration;
  return {
    type: "invulnerable",
    target: target.id,
    value: duration
  }
}


function updateThreatLevel(game, index, value) {
  const half = (value / 2) | 0;
  let highest = game.players[game.enemyTarget].threat;
  for (const player of game.players) {
    if (player.index === index) {
      player.threat += value;
    } else {
      player.threat -= half;
    }
    // if (player.threat < 0) {
    //   player.threat = 0;
    // }
    if (player.threat >= highest) {
      highest = player.threat;
      game.enemyTarget = player.index;
    }
  }
}


function adjustTurnOrder(game, value) {
  let threshold = 1000000;
  for (const player of game.players) {
    const speed = player.speed - value;
    player.speed = speed;
    if (speed < threshold) {
      game.currentTurn = player.id;
      threshold = speed;
    }
  }
}


function doEnemyReaction(game, player, usedSkill) {
  const enemy = game.enemy;

  if (enemy.effects.stunned) { return; }

  // Resolve the skill
  const skill = enemy.skills[0];
  // console.log("Enemy used a skill:", skill.data.id, player);
  resolveSkill(game, enemy, skill, { target: player.index });
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
  // healingModifier: 0,
  // damageModifier: 0,

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

  // update skill cooldowns
  for (const skill of character.skills) {
    if (skill.wait > 0) {
      skill.wait--;
    }
  }
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

/*******************************************************************************
  Rune Setup
*******************************************************************************/

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,

  setup(players) {
    // players: array of string IDs
    const game = {
      enemy: newEnemyCharacter(),
      players: [],
      currentTurn: null,
      events: [],
      enemyTarget: 0
    };
    let speed = 1000000;
    for (const playerId of players) {
      const player = newPlayerCharacter(playerId, game.players.length, `Player ${game.players.length + 1}`);
      game.players.push(player);
      if (player.speed < speed) {
        game.currentTurn = player.id;
        speed = player.speed;
      }
      game.enemyTarget = player.index;
    }
    return game;
  },

  actions: {
    useSkill(payload, { game, playerId }) {
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
