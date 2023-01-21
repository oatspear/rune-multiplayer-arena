// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const Rune = {
  players: {
    "randomPlayerId1": {
      displayName: "Oatspear",
      playerId: "randomPlayerId1"
    }
  },
  game: {},
  actions: {},

  initLogic(params) {
    console.log("Rune.initLogic()");
    console.log("minPlayers:", params.minPlayers);
    console.log("maxPlayers:", params.maxPlayers);
    console.log("setup:", params.setup);
    console.log("actions:", params.actions);

    this.game = params.setup(this.players);

    const context = { game: this.game, playerId: "randomPlayerId1" };
    for (const key of Object.keys(params.actions)) {
      this.actions[key] = (function (k) {
        return function (payload) {
          return params.actions[k](payload, context);
        };
      })(key);
      console.log(`Rune.actions.${key} =`, this.actions[key]);
    }
  },

  initClient(params) {
    console.log("Rune.initClient()");
    console.log("visualUpdate:", params.visualUpdate);
  }
};
