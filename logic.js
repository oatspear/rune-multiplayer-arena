// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

/*******************************************************************************
  Battle Logic
*******************************************************************************/

const MechanicsHandlers = (function () {
  function attackTargets() {

  }

  const handlers = Array(Object.keys(SkillMechanics).length);
  handlers[SkillMechanics.ATTACK_TARGETS] = attackTargets;

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
  setup: (players) => {
    const scores = {}
    for (let playerId in players) {
      scores[playerId] = 0
    }
    return { scores }
  },
  actions: {
    myAction: (payload, { game, playerId }) => {
      // Check it's not the other player's turn
      if (game.lastPlayerTurn !== playerId) {
        throw Rune.invalidAction()
      }

      // Increase score and switch turn
      game.scores[playerId]++
      game.lastPlayerTurn = playerId

      // Determine if game has ended
      if (isVictoryOrDraw(game)) {
        Rune.gameOver()
      }
    },
  },
});
