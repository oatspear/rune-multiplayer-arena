// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Utility
*******************************************************************************/


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


/*******************************************************************************
  Data
*******************************************************************************/


function targetModeSelf() { return 0; }
function targetModeAlly() { return 1; }
function targetModeEnemy() { return 2; }
function targetModeAllAllies() { return 3; }
function targetModeAllEnemies() { return 4; }
function targetModeAllCharacters() { return 5; }


function newSkill(params) {
  checkProperty(params, "name", "string");
  checkProperty(params, "speed", "number");
  const target = params.target;
  assert(target == null || (target >= 0 && target <= targetModeAllCharacters()),
    `unknown target mode: ${target}`);
  return {
    id: Skills.length,
    name: params.name,
    speed: params.speed,
    cooldown: params.cooldown || 0,
    target: target || targetModeSelf(),
    icon: params.icon || "skill",
    description: params.description || "No description."
  };
}


function newEnemy() {
  return {

  };
}


function newPlayer(playerId) {
  return {
    id: playerId,
    speed: 5
  };
}


/*******************************************************************************
  Battle Logic
*******************************************************************************/


function getSkill(classId, id) {
  if (id <= 0) {
    return newSkill();
  }
  switch (classId) {
    case 0:  // Ranger
      switch (id) {
        case 0:
          return;
        default:

      }

    case 1:  // Warrior

    case 2:  // Rogue

    case 3:  // Mage

    case 4:  // Druid

    case 5:  // Priest

    default:
      return newSkill()
  }
  return {
    speed: 5
  };
}


function resolveSkill(skill, game) {
  // Determine if game has ended
  if (isGameOver(game)) {
    Rune.gameOver();
  }
}


function adjustTurnOrder(game, value) {
  let speed = 1000;
  for (const id in game.players) {
    const player = game.players[id];
    let s = player.speed - value;
    player.speed = s;
    if (s < speed) {
      game.currentTurn = playerId;
      speed = s;
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
      currentTurn: null
    };
    let speed = 1000;
    for (let playerId in players) {
      const player = null;
      game.players[playerId] = player;
      if (player.speed < speed) {
        game.currentTurn = playerId;
        speed = player.speed;
      }
    }
    return game;
  },

  actions: {
    useSkill(payload, { game, playerId }) {
      const player = game.players[playerId];

      // Check if it's the player's turn
      if (game.currentTurn !== playerId) {
        throw Rune.invalidAction();
      }

      // Resolve the skill
      const skill = getSkill(player.classId, player.skills[payload.skill]);
      console.log(playerId, "used a skill:", payload.skill, payload.target);
      resolveSkill(skill, game);

      // Move the player down the queue
      const speed = player.speed;
      player.speed += skill.speed;

      // Determine enemy reaction
      doEnemyReaction(game, player, skill);

      // Adjust turn order for everyone
      adjustTurnOrder(game, speed);

      console.log("game state:", game);
    }
  },
});
