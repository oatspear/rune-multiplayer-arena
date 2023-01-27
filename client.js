// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const { createApp } = Vue;


function _sortCharactersById(a, b) {
  if (a.id < b.id) { return -1; }
  if (a.id > b.id) { return 1; }
  return 0;
}


function newClientSkill(id) {
  const data = Skills[id];
  const skill = newSkillInstance(data);
  skill.id = id;
  skill.data = data;
  return skill;
}


function newClientEnemy(data, index) {
  return newClientPlayer(data, index);  // FIXME
}


function newClientPlayer(data, index) {
  if (data == null) { return { id: null }; }
  const cls = Classes[data.classId];
  const skills = [];
  for (const s of data.skills) {
    skills.push(newClientSkill(s.id));
  }
  return {
    id: data.id,
    index: index,
    name: data.name,
    characterClass: cls,
    speed: data.speed,
    power: data.power,
    health: data.health,
    currentHealth: data.currentHealth,
    skills: skills
  };
}


const app = createApp({
  data() {
    return {
      playerId: undefined,
      currentTurn: 0,
      enemies: [],
      players: [],
      events: [],
      ui: {
        state: "initial",
        targetMode: null,
        selectedEnemy: null,
        selectedPlayer: null,
        footer: {
          display: false,
          selectedSkill: null,
          selectedTarget: null,
          characterData: null,
          skills: [],
          itemName: "",
          itemDescription: ""
        }
      }
    };
  },

  computed: {
    thisPlayer() {
      for (let i = this.players.length - 1; i >= 0; i--) {
        if (this.players[i].id === this.playerId) {
          return this.players[i];
        }
      }
      return null;
    },

    highlightEnemies() {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == targetModeEnemy();
    },

    highlightPlayers() {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == targetModeAlly();
    }
  },

  methods: {
    setGameState(game, playerId) {
      // Hard reset of the current game state
      console.log("visualUpdate callback was called");
      this.playerId = playerId;
      this.ui.state = "battle";
      this.enemies = [newClientEnemy(game.enemy, 0)];
      this.setPlayerStates(game.players);
      this.currentTurn = game.currentTurn;
      this.events = game.events;
      this.resetFooterState();
    },

    setPlayerStates(players) {
      this.players = [];
      for (let i = 0; i < players.length; ++i) {
        this.players.push(newClientPlayer(players[i], i));
      }
    },

    resetFooterState() {
      const self = this.thisPlayer;
      if (self == null) {
        this.ui.footer.display = false;
        return;
      }
      this.ui.footer.display = true;
      if (this.ui.footer.selectedSkill != null) {
        const skill = self.skills[this.ui.footer.selectedSkill];
        this.ui.footer.itemName = skill.data.name;
        this.ui.footer.itemDescription = this.buildSkillDescription(skill.data);
      } else {
        this.ui.footer.itemName = "";
        this.ui.footer.itemDescription = "Choose a skill."
      }
      if (this.ui.selectedEnemy != null) {
        this.ui.footer.characterData = this.enemies[this.ui.selectedEnemy];  // FIXME
      } else if (this.ui.selectedPlayer != null) {
        this.ui.footer.characterData = this.players[this.ui.selectedPlayer];
      } else {
        this.ui.footer.characterData = self;
      }
      this.ui.footer.skills = self.skills;
    },

    buildSkillDescription(data) {
      if (data.cooldown <= 0) { return data.description; }
      return `${data.description} [Cooldown: ${data.cooldown}]`;
    },

    onSkillSelected(i) {
      const self = this.thisPlayer;
      const skill = self.skills[i];
      // reset selection
      this.ui.footer.characterData = self;
      this.ui.targetMode = skill.data.target;
      switch (skill.data.target) {
        case targetModeSelf():
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = self.index;
          this.ui.footer.selectedTarget = self.id;
          break;
        case targetModeAlly():
          this.ui.selectedEnemy = null;
          this.ui.footer.selectedTarget = this.ui.selectedPlayer;
          break;
        case targetModeEnemy():
          this.ui.selectedPlayer = null;
          this.ui.footer.selectedTarget = this.ui.selectedEnemy;
          break;
        default:
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = null;
          this.ui.footer.selectedTarget = 0;
      }
      // select or deselect skill
      // this.ui.footer.selectedSkill = (this.ui.footer.selectedSkill == i) ? null : i;
      this.ui.footer.selectedSkill = i;
      this.resetFooterState();
    },

    onCancelSkill() {
      const self = this.thisPlayer;
      // reset selection
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      this.ui.footer.characterData = self;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      this.resetFooterState();
    },

    onUseSkill() {
      const self = this.thisPlayer;
      const i = this.ui.footer.selectedSkill;
      const t = this.ui.footer.selectedTarget;
      // reset selection
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      this.ui.footer.characterData = self;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      this.resetFooterState();
      // call logic action
      console.log(this.playerId, "selected skill", self.skills[i].id);
      const action = Rune.actions[self.skills[i].id];
      console.log("action:", action);
      action({ skill: i, target: t });
    },

    onEnemySelected(character) {
      const i = character.index;
      this.ui.selectedPlayer = null;
      if (this.ui.footer.selectedSkill != null) {
        if (this.ui.targetMode == targetModeEnemy()) {
          this.ui.selectedEnemy = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        if (i == this.ui.selectedEnemy) {
          this.ui.selectedEnemy = null;
          this.ui.footer.characterData = this.thisPlayer;
        } else {
          this.ui.selectedEnemy = i;
          this.ui.footer.characterData = character;
        }
      }
    },

    onPlayerSelected(character) {
      const i = character.index;
      this.ui.selectedEnemy = null;
      if (this.ui.footer.selectedSkill != null) {
        if (this.ui.targetMode == targetModeAlly()) {
          this.ui.selectedPlayer = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        if (i == this.ui.selectedPlayer) {
          this.ui.selectedPlayer = null;
          this.ui.footer.characterData = this.thisPlayer;
        } else {
          this.ui.selectedPlayer = i;
          this.ui.footer.characterData = character;
        }
      }
    },

    refreshSlides() {
      const slidesContainer = document.getElementById("slides-container");
      const slide = document.querySelector(".slide");
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft = this.currentTurn * slideWidth;
    }
  },

  mounted() {
    // this.resetFooterState();
    initRuneClient(this);
  }
});

app.component("BattleBoard", BattleBoard);
app.component("BattleHeader", BattleHeader);
app.component("BattleScene", BattleScene);
app.component("BattleTile", BattleTile);
app.component("BattleFooter", BattleFooter);
app.component("BattlePlayerInfo", BattlePlayerInfo);
app.component("BattleActionBar", BattleActionBar);
app.component("BattleIconLabel", BattleIconLabel);

app.mount("#app");

/*******************************************************************************
  Rune Setup
*******************************************************************************/

function initRuneClient(vueApp) {
  Rune.initClient({
    visualUpdate: ({
      newGame,
      oldGame,
      yourPlayerId,
      players,
      action,
      event,
      rollbacks,
    }) => {
      // Update interface based on game state from logic.js.
      // The `visualUpdate` function must be synchronous.
      // It may trigger async functions if needed, but cannot `await` them.
      console.log(`visualUpdate(yourPlayerId: ${yourPlayerId}, action: ${action}, event: ${event})`);
      console.log("Got a new game state:", newGame);
      console.log("rollbacks:", rollbacks);
      if (action == null) {
        // Not a partial update. Might be a post setup call, for example.
        vueApp.setGameState(newGame, yourPlayerId);
      } else {
        // FIXME
        vueApp.setGameState(newGame, yourPlayerId);
      }
    },
  });
}
