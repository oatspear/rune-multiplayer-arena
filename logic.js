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


function checkProperty(obj, prop, type) {
  assert(
    (obj[prop] != null) && (typeof obj[prop] === type),
    `expected property "${prop}" of type ${type} in ${obj}`
  );
}


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


function isVictoryOrDraw(game) {
  // Check winner
}

/*******************************************************************************
  Rune Setup
*******************************************************************************/

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,

  setup(players) {
    const scores = {};
    for (let playerId in players) {
      scores[playerId] = 0
    }
    return {
      scores
    };
  },

  actions: {
    useSkill(payload, { game, playerId }) {
      // Check it's not the other player's turn
      // if (game.lastPlayerTurn !== playerId) {
      //   throw Rune.invalidAction()
      // }

      // Increase score and switch turn
      // game.scores[playerId]++
      // game.lastPlayerTurn = playerId

      // Determine if game has ended
      // if (isVictoryOrDraw(game)) {
      //   Rune.gameOver()
      // }
      console.log(playerId, "used a skill:", payload.skill, payload.target);
      console.log("game state:", game);
    }
  },
});
