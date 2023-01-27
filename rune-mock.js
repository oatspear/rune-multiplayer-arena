// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const RANDOM_PLAYER_ID = "randomPlayerId1";

const Rune = {
  players: {
    "randomPlayerId1": {
      displayName: "Oatspear",
      playerId: RANDOM_PLAYER_ID
    }
  },
  game: {},
  actions: {},
  visualUpdate: null,

  initLogic(params) {
    console.log("Rune.initLogic()");
    console.log("minPlayers:", params.minPlayers);
    console.log("maxPlayers:", params.maxPlayers);
    console.log("setup:", params.setup);
    console.log("actions:", params.actions);

    this.game = params.setup(Object.keys(this.players));

    const self = this;
    for (const key of Object.keys(params.actions)) {
      this.actions[key] = (function (k) {
        const cb = params.actions[k];
        return function (payload) {
          const players = self.players;
          const oldGame = self.game;
          const newGame = JSON.parse(JSON.stringify(oldGame));
          const context = { game: newGame, playerId: RANDOM_PLAYER_ID };
          console.time("action");
          cb(payload, context);
          console.timeEnd("action");
          self.game = newGame;
          window.setTimeout(function () {
            console.time("visualUpdate");
            self.visualUpdate({
              newGame: newGame,
              oldGame: oldGame,
              yourPlayerId: RANDOM_PLAYER_ID,
              players: players,
              action: {
                action: k,
                params: payload,
                playerId: RANDOM_PLAYER_ID
              },
              event: undefined,
              rollbacks: []
            });
            console.timeEnd("visualUpdate");
          }, 0);
        };
      })(key);
      console.log(`Rune.actions.${key} =`, this.actions[key]);
    }

    // temporary, until initClient is called
    this.visualUpdate = function () {
      self.visualUpdate({
        newGame: self.game,
        oldGame: self.game,
        yourPlayerId: RANDOM_PLAYER_ID,
        players: self.players,
        action: undefined,
        event: {event: "stateSync"},
        rollbacks: []
      });
    };
  },

  initClient(params) {
    console.log("Rune.initClient()");
    console.log("visualUpdate:", params.visualUpdate);
    const callback = this.visualUpdate;
    this.visualUpdate = params.visualUpdate;
    callback();
  },

  invalidAction() {
    return new Error();
  },

  gameOver() {
    alert("Game Over!");
    throw new Error();
  }
};
