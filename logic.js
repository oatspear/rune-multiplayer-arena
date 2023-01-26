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


/*******************************************************************************
  Skill Data
*******************************************************************************/


function newSkillInstance(data) {
  return {
    id: data.id,
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


/*******************************************************************************
  Player Character Data
*******************************************************************************/


function newPlayer(playerId) {
  return {
    id: playerId,
    classId: "ranger",
    isPlayerCharacter: true,
    power: 10,
    health: 20,
    currentHealth: 20,
    speed: 5,
    threat: 0,
    skills: [
      newSkillInstance(skillDataAttack()),
      newSkillInstance(skillDataRangedAttack()),
      newSkillInstance(skillDataGreaterHeal()),
      newSkillInstance(skillDataRest())
    ]
  };
}


/*******************************************************************************
  Enemy Character Data
*******************************************************************************/


function newEnemy() {
  return {
    id: 0,
    classId: "boss",
    isPlayerCharacter: false,
    power: 10,
    health: 200,
    currentHealth: 200,
    speed: 8,
    skills: [
      newSkillInstance(skillDataRest())
    ]
  };
}


/*******************************************************************************
  Battle Logic
*******************************************************************************/


function processPlayerSkill(game, playerId, skill, args) {
  const player = game.players[playerId];

  // Check if it's the player's turn
  if (game.currentTurn !== playerId) {
    throw Rune.invalidAction();
  }

  // Move the player down the queue
  adjustTurnOrder(game, player.speed);
  player.speed += skill.speed;

  // Clear the event queue
  game.events = [];

  // Resolve the skill
  console.log(playerId, "used a skill:", skill.id, args.target);
  resolveSkill(game, player, skill, args);
  updateThreatLevel(game, playerId, skill.threat);

  // Determine enemy reaction
  doEnemyReaction(game, player, skill);

  console.log("game state:", game);
}


function resolveSkill(game, user, skill, args) {
  const target = getTarget(game, user, skill.target, args.target);

  switch (skill.mechanic) {
    case constHealTargetPercent():
      return handleHealTargetByPercent(game, user, target, skill);

    case constAttackTarget():
      return handleAttackTarget(game, user, target, skill);

    case constDamageTarget():
      return handleDamageTargetByFactor(game, user, target, skill);

    case constHealTarget():
      return handleHealTargetByFactor(game, user, target, skill);

    default:
      throw Rune.invalidAction();
  }


  // Determine if game has ended
  if (isGameOver(game)) {
    Rune.gameOver();
  }
}


function getTarget(game, user, targetMode, targetId) {
  if (!targetMode) {
    return user;
  }
  if (targetMode === targetModeAlly()) {
    return user.isPlayerCharacter ? game.players[targetId] : user;
  }
  if (targetMode === targetModeEnemy()) {
    return user.isPlayerCharacter ? game.enemy : game.players[targetId];
  }
  const targets = [];
  if (targetMode !== targetModeAllAllies()) {
    // all enemies or all characters
    if (user.isPlayerCharacter) {
      targets.push(game.enemy);
    } else {
      targets.push.apply(targets, Object.values(game.players));
    }
  }
  if (targetMode !== targetModeAllEnemies()) {
    // all allies or all characters
    if (user.isPlayerCharacter) {
      targets.push.apply(targets, Object.values(game.players));
    } else {
      targets.push(game.enemy);
    }
  }
  return targets;
}


function handleHealTargetByPercent(game, user, target, skill) {
  const damage = ((target.health * skill.healingPercent) | 0) || 1;
  healTarget(game, target, damage);
}


function handleAttackTarget(game, user, target, skill) {
  dealDamageToTarget(game, target, user.power);
  dealDamageToTarget(game, user, target.power);
}


function handleDamageTargetByFactor(game, user, target, skill) {
  const damage = ((user.power * skill.powerFactor) | 0) || 1;
  dealDamageToTarget(game, target, damage);
}


function handleHealTargetByFactor(game, user, target, skill) {
  const damage = ((user.power * skill.powerFactor) | 0) || 1;
  healTarget(game, target, damage);
}


function dealDamageToTarget(game, target, damage) {
  const hp = target.currentHealth;
  target.currentHealth -= damage;
  game.events.push({
    type: "damage",
    target: target.id,
    value: damage,
    startingHealth: hp
  });
}


function healTarget(game, target, damage) {
  const hp = target.currentHealth;
  target.currentHealth += damage;
  if (target.currentHealth > target.health) {
    target.currentHealth = target.health;
  }
  game.events.push({
    type: "heal",
    target: target.id,
    value: damage,
    startingHealth: hp
  });
}


function updateThreatLevel(game, playerId, value) {
  const half = (value / 2) | 0;
  let highest = game.players[game.enemyTarget].threat;
  for (const id in game.players) {
    const player = game.players[id];
    if (id === playerId) {
      player.threat += value;
    } else {
      player.threat -= half;
    }
    // if (player.threat < 0) {
    //   player.threat = 0;
    // }
    if (player.threat >= highest) {
      highest = player.threat;
      game.enemyTarget = id;
    }
  }
}


function reactToRest(game, enemy, currentPlayer) {
  const player = game.players[game.enemyTarget];
  dealDamageToTarget(game, player, enemy.power);
}


function reactToDirectDamage(game, enemy, currentPlayer) {
  const player = game.players[game.enemyTarget];
  dealDamageToTarget(game, player, enemy.power);
}


function reactToDirectHealing(game, enemy, currentPlayer) {
  let player = game.players[currentPlayer];
  if ((player.currentHealth / player.health) > 0.5) {
    player = game.players[game.enemyTarget];
  }
  dealDamageToTarget(game, player, enemy.power);
}


function slowTargetDown(game, target, value) {
  // Move the target down the queue
  const speed = target.speed;
  target.speed += value;
  adjustTurnOrder(game, speed);
}


function adjustTurnOrder(game, value) {
  let threshold = Infinity;
  for (const id in game.players) {
    const player = game.players[id];
    const speed = player.speed - value;
    player.speed = speed;
    if (speed < threshold) {
      game.currentTurn = id;
      threshold = speed;
    }
  }
}


function doEnemyReaction(game, player, usedSkill) {
  const enemy = game.enemy;

  // Resolve the skill
  const skill = skillDataAttack();
  console.log("Enemy used a skill:", skill.id, player);
  resolveSkill(game, enemy, skill, { target: player.id });
}


function isGameOver(game) {
  if (game.enemy.currentHealth <= 0) {
    return true;
  }
  for (const id in game.players) {
    const player = game.players[id];
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
    const game = {
      enemy: newEnemy(),
      players: {},
      currentTurn: null,
      events: [],
      enemyTarget: null
    };
    let speed = Infinity;
    for (let playerId in players) {
      const player = newPlayer(playerId);
      game.players[playerId] = player;
      if (player.speed < speed) {
        game.currentTurn = playerId;
        speed = player.speed;
      }
      game.enemyTarget = playerId;
    }
    return game;
  },

  actions: {
    rest(payload, { game, playerId }) {
      const skill = skillDataRest();
      // TODO validate skill
      processPlayerSkill(game, playerId, skill, payload);
    },

    attack(payload, { game, playerId }) {
      const skill = skillDataAttack();
      // TODO validate skill
      processPlayerSkill(game, playerId, skill, payload);
    },

    rangedAttack(payload, { game, playerId }) {
      const skill = skillDataRangedAttack();
      // TODO validate skill
      processPlayerSkill(game, playerId, skill, payload);
    },

    greaterHeal(payload, { game, playerId }) {
      const skill = skillDataGreaterHeal();
      // TODO validate skill
      processPlayerSkill(game, playerId, skill, payload);
    }
  },
});


/*******************************************************************************
  To Be Removed
*******************************************************************************/


// function startGameTurn(game, playerId, skillId) {
//   // Check whether it is the player's turn
//   if (game.currentTurn !== playerId) {
//     throw Rune.invalidAction();
//   }
//
//   // Move the player down the queue
//   const player = game.players[playerId];
//   const speed = player.speed;
//   player.speed += skill.speed;
//
//   // Clear the event history for this turn
//   game.events = [{
//     type: "skill",
//     value: skillId,
//     user: playerId
//   }];
// }


// function getTargetEnemy(game, target) {
//   return game.enemy;
// }


// function speedValueRest() { return 2; }
// function speedValueAttack() { return 5; }
// function speedValueDirectDamage() { return 7; }
// function speedValueDirectHealing() { return 8; }


// function assert(condition, message) {
//     if (!condition) {
//         throw new Error(message || "Assertion failed");
//     }
// }


// function checkProperty(obj, prop, type) {
//   assert(
//     (obj[prop] != null) && (typeof obj[prop] === type),
//     `expected property "${prop}" of type ${type} in ${obj}`
//   );
// }
