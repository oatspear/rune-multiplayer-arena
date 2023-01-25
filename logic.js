// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Data
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


function healFactorRest() { return 0.1; }


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
    threat: 5,
    mechanic: constAttackTarget()
  };
}


function newEnemy() {
  return {
    isPlayerCharacter: false,
  };
}


function newPlayer(playerId) {
  return {
    id: playerId,
    isPlayerCharacter: true,
    speed: 5
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
  console.log(playerId, "used a skill:", skill.id, payload.target);
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
      const damage = ((target.health * skill.healingPercent) | 0) || 1;
      healTarget(game, target, damage);
      break;

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


function handleHealTargetByPercent(game, target, percent) {
  const damage = ((target.health * percent) | 0) || 1;
  healTarget(game, target, damage);
}


function handleAttackTarget(game, user, target) {

}


function handleDamageTargetByFactor(game, user, target, factor) {
  const damage = ((user.power * factor) | 0) || 1;
  dealDamageToTarget(game, target, damage);
}


function dealDamageToTarget(game, target, damage) {
  target.currentHealth -= damage;
  game.events.push({
    type: "damage",
    target: target.id,
    value: damage
  });
}


function healTarget(game, target, damage) {
  target.currentHealth += damage;
  if (target.currentHealth > target.health) {
    target.currentHealth = target.health;
  }
  game.events.push({
    type: "heal",
    target: target.id,
    value: damage
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


function doEnemyReaction(game, player, skill) {
  const enemy = game.enemy;

  // Resolve the skill
  const skill = getSkill(enemy.classId, enemy.skills[0]);
  console.log("Enemy used a skill:", skill.id, player);
  resolveSkill(skill, game);
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
      enemy: null,
      players: {},
      currentTurn: null,
      events: [],
      threatLevel: {},
      enemyTarget: null
    };
    let speed = Infinity;
    for (let playerId in players) {
      const player = null;
      game.players[playerId] = player;
      if (player.speed < speed) {
        game.currentTurn = playerId;
        speed = player.speed;
      }
      game.threatLevel[playerId] = 0;
      game.enemyTarget = playerId;
    }
    return game;
  },

  actions: {
    rest(payload, { game, playerId }) {
      const skill = skillDataRest();
      // TODO validate skill
      processPlayerSkill(game, playerId, skill, payload);
      startGameTurn(game, playerId, payload.skill);
      const player = game.players[playerId];
      const enemy = game.enemy;
      const damage = ((healFactorRest() * player.health) | 0) || 1;
      healTarget(game, player, damage);
      updateThreatLevel(game, playerId, -player.power);
      slowTargetDown(game, player, speedValueRest());
      reactToRest(game, enemy, player);
    },

    attack(payload, { game, playerId }) {
      startGameTurn(game, playerId, payload.skill);
      const player = game.players[playerId];
      const enemy = game.enemy;
      dealDamageToTarget(game, enemy, player.power);
      dealDamageToTarget(game, player, enemy.power);
      updateThreatLevel(game, playerId, player.power * 10);
      slowTargetDown(game, player, speedValueAttack());
    },

    directDamage(payload, { game, playerId }) {
      startGameTurn(game, playerId, payload.skill);
      const player = game.players[playerId];
      const enemy = game.enemy;
      const damage = (player.power * 1.5) | 0;
      dealDamageToTarget(game, enemy, damage);
      updateThreatLevel(game, playerId, damage * 5);
      slowTargetDown(game, player, speedValueDirectDamage());
      reactToDirectDamage(game, enemy, player);
    },

    directHealing(payload, { game, playerId }) {
      startGameTurn(game, playerId, payload.skill);
      const player = game.players[playerId];
      const target = game.players[payload.target];
      const enemy = game.enemy;
      const damage = (player.power * 1.25) | 0;
      healTarget(game, target, damage);
      updateThreatLevel(game, playerId, damage * 6);
      slowTargetDown(game, player, speedValueDirectHealing());
      reactToDirectHealing(game, enemy, player);
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
