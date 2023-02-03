// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const { createApp } = Vue;


const DEFAULT_ANIM_DURATION = 1000;


// function _sortCharactersById(a, b) {
//   if (a.id < b.id) { return -1; }
//   if (a.id > b.id) { return 1; }
//   return 0;
// }


function newAnimationSequence(game, playerId) {
  const events = [];
  if (game.events.length > 0) {
    Array.prototype.push.apply(events, game.events);
  }
  return {
    events: events,
    finalState: game,
    playerId: playerId
  };
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
  if (data == null) {
    return { id: null, index: index };
  }
  const cls = Classes[data.classId];
  const skills = [];
  for (const s of data.skills) {
    skills.push(newClientSkill(s.id));
  }
  return {
    id: data.id,
    index: index,
    playerId: data.playerId,
    name: data.name,
    classData: cls,
    speed: data.speed,
    power: data.power,
    health: data.health,
    currentHealth: data.currentHealth,
    skills: skills,
    animation: null
  };
}


const app = createApp({
  data() {
    return {
      playerId: undefined,
      currentTurn: 0,
      enemies: [],
      players: [],
      history: [
        null,
        null,
        null,
        null,
        null,
        null
      ],
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
        },
        isAnimating: false,
        animationQueue: []
      }
    };
  },

  computed: {
    thisPlayer() {
      for (let i = this.players.length - 1; i >= 0; i--) {
        if (this.players[i].playerId === this.playerId) {
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
      this.eventQueue = game.events;
      this.resetFooterState();
    },

    setPlayerStates(players) {
      this.players = [];
      for (let i = 0; i < players.length; ++i) {
        this.players.push(newClientPlayer(players[i], i));
      }
    },

    animateNewGameState(game, playerId) {
      console.log("enqueue animation events");
      this.ui.animationQueue.push(newAnimationSequence(game, playerId));
      if (!this.ui.isAnimating) {
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      }
    },

    doNextAnimation() {
      if (this.ui.isAnimating) { return false; }
      if (this.ui.animationQueue.length === 0) {
        // No more animations. Reset UI state.
        return false;
      }
      const seq = this.ui.animationQueue[0];
      console.log("begin animation sequence", seq);
      if (seq.events.length === 0) {
        // Reached the end of this animation sequence
        this.ui.animationQueue.splice(0, 1);
        this.setGameState(seq.finalState, seq.playerId);
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      } else {
        // Animate the next event
        const event = seq.events.splice(0, 1)[0];
        this.animateEvent(event);
      }
      return true;
    },

    animateEvent(event) {
      console.log("animateEvent:", event);
      this.ui.isAnimating = true;
      this.history.splice(0, 1);
      this.history.push(event);
      const i = event.target;
      if (i == null) {
        if (event.isPlayer) {
          for (const character of this.players) {
            character.animation = event;
          }
        } else {
          for (const character of this.enemies) {
            character.animation = event;
          }
        }
      } else {
        const character = event.isPlayer ? this.players[i] : this.enemies[i];
        character.animation = event;
      }
      window.setTimeout(() => {
        this.stopEventAnimation();
        this.doNextAnimation();
      }, DEFAULT_ANIM_DURATION);
    },

    stopEventAnimation() {
      this.ui.isAnimating = false;
      for (const character of this.enemies) {
        character.animation = null;
      }
      for (const character of this.players) {
        character.animation = null;
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

    onCharacterAnimationFinished(character) {
      if (character.animation != null) {
        character.animation = null;
        this.ui.isAnimating--;
        if (this.ui.isAnimating <= 0) {
          this.ui.isAnimating = 0;
          this.doNextAnimation();
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
app.component("BattleHistoryEvent", BattleHistoryEvent);
app.component("BattleScene", BattleScene);
app.component("BattleCharacter", BattleCharacter);
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
      console.log("visualUpdate()");
      console.log("yourPlayerId:", yourPlayerId);
      console.log("action:", action);
      console.log("event:", event);
      console.log("new game state:", newGame);
      console.log("rollbacks:", rollbacks);
      if (action == null) {
        // Not a partial update. Might be a post-setup call, for example.
        vueApp.setGameState(newGame, yourPlayerId);
      } else {
        vueApp.animateNewGameState(newGame, yourPlayerId);
      }
    },
  });
}
