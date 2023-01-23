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
    mechanics: params.mechanics || [],
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

const MechanicsHandlers = (function () {
  const handlers = Array(Object.keys(SkillMechanics).length);

  handlers[SkillMechanics.ATTACK_TARGETS] = function (params, game) {};
  handlers[SkillMechanics.DAMAGE_TARGETS] = function (params, game) {};
  handlers[SkillMechanics.HEAL_TARGETS] = function (params, game) {};

  for (const k in Object.keys(SkillMechanics)) {
    assert(handlers[k] != null, `expected handler for SkillMechanics.${k}`);
  }

  return handlers;
})();


function getSkill(id) {
  return {
    speed: 5
  };
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


function doEnemyReaction(game) {
  
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
      const skill = getSkill(player.skills[payload.skill]);
      console.log(playerId, "used a skill:", payload.skill, payload.target);
      resolveSkill(skill, game);

      // Determine if game has ended
      if (isGameOver(game)) {
        Rune.gameOver();
      }

      // Adjust turn order for everyone
      const speed = player.speed;
      player.speed += skill.speed;
      adjustTurnOrder(game, speed);

      // Determine enemy reaction
      doEnemyReaction(game, player, skill);

      // Determine if game has ended
      if (isGameOver(game)) {
        Rune.gameOver();
      }

      console.log("game state:", game);
    }
  },
});
