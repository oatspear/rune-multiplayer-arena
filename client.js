// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const { createApp } = Vue;


const DEFAULT_ANIM_DURATION = 1000;

const UIState = newEnum([
  "INIT",
  "CHOOSE_ACTION",
  "CHOOSE_TARGET",
  "SYNC",
  "ANIMATION",
  "AWAITING_PLAYER_ACTION"
]);


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


function newClientSkill(skillInstance) {
  const meta = Skills[skillInstance.data.id];
  // NOTE: `skill.data` is shared! `Object.assign` is a shallow copy.
  const skill = Object.assign({}, skillInstance);
  return Object.assign(skill, meta);
}


function newClientEnemy(data, index) {
  return newClientPlayer(data, index);  // FIXME
}


function newClientPlayer(data, index) {
  if (data == null) {
    return { id: null, index: index };
  }
  const cls = Classes[data.classId];
  const skills = data.skills.map(newClientSkill);
  // for (const skill of data.skills) {
  //   // skills.push(newClientSkill(s.id));
  //   skills.push(newClientSkill(skill));
  // }
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
      characters: {},
      history: [null, null, null, null, null, null],
      ui: {
        // syncing: true,
        state: UIState.INIT,
        // observer: true,
        targetMode: null,
        selectedEnemy: null,
        selectedPlayer: null,
        footer: {
          display: false,
          observer: true,
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
    activeCharacter() {
      return this.characters[this.currentTurn];
    },

    controlledCharacter() {
      if (this.playerId == null) { return null; }
      const character = this.characters[this.currentTurn];
      return this.playerId === character.playerId ? character : null;
    },

    isBattleState() {
      return this.ui.state != UIState.INIT;
    },

    isObserverMode() {
      if (this.playerId == null) { return true; }
      const state = this.ui.state;
      if (state === UIState.CHOOSE_ACTION) { return false; }
      if (state === UIState.CHOOSE_TARGET) { return false; }
      return true;
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
    onSetupDone(game, playerId) {
      assert(this.ui.state === UIState.INIT, `UI state: ${this.ui.state}`);
      this.setGameState(game, playerId);
      // TODO animate battle start here
      window.setTimeout(() => { this.setActionUIState(); }, DEFAULT_ANIM_DURATION);
    },

    setActionUIState() {
      const character = this.controlledCharacter;
      if (character != null) {
        this.ui.state = UIState.CHOOSE_ACTION;
      } else {
        this.ui.state = UIState.AWAITING_PLAYER_ACTION;
      }
      this.resetFooterState();
    },

    setGameState(game, playerId) {
      // Hard reset of the current game state
      console.log("setGameState()");
      this.playerId = playerId;
      this.ui.state = "battle";
      this.enemies = [newClientEnemy(game.enemy, 0)];
      this.setPlayerStates(game.players);
      this.resetCharacterMap();
      this.currentTurn = game.currentTurn;
      this.eventQueue = game.events;
      // this.resetFooterState();
    },

    setPlayerStates(players) {
      this.players = [];
      for (let i = 0; i < players.length; ++i) {
        this.players.push(newClientPlayer(players[i], i));
      }
    },

    resetCharacterMap() {
      this.characters = {};
      for (const c of this.enemies) {
        this.characters[c.id] = c;
      }
      for (const c of this.players) {
        this.characters[c.id] = c;
      }
    },

    animateNewGameState(game, playerId) {
      console.log("animateNewGameState()");
      this.ui.animationQueue.push(newAnimationSequence(game, playerId));
      if (!this.ui.isAnimating) {
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      }
    },

    doNextAnimation() {
      if (this.ui.isAnimating) { return false; }
      if (this.ui.animationQueue.length === 0) {
        // No more animations. Reset UI state.
        this.setActionUIState();
        return false;
      }
      this.ui.state = UIState.ANIMATION;
      const sequence = this.ui.animationQueue[0];
      console.log("begin animation sequence", sequence);
      if (sequence.events.length === 0) {
        // Reached the end of this animation sequence
        this.ui.animationQueue.splice(0, 1);
        this.setGameState(sequence.finalState, sequence.playerId);
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      } else {
        // Animate the next event
        const event = sequence.events.splice(0, 1)[0];
        this.animateEvent(event);
      }
      return true;
    },

    animateEvent(event) {
      console.log("animateEvent:", event);
      if (event.type === "skill") {
        // FIXME
        window.setTimeout(() => {
          this.doNextAnimation();
        }, 0);
        return;
      }

      this.ui.isAnimating = true;
      this.history.splice(0, 1);
      this.history.push(event);

      if (event.multitarget) {
        // TODO
        // for (const character of this.players) {
        //   character.animation = event;
        // }
      } else {
        const i = event.target;
        if (i != null) {
          const character = i >= 0 ? this.players[i] : this.enemies[-i - 1];
          character.animation = event;
        } else {
          // FIXME e.g. notification-type event or death
        }
      }
      window.setTimeout(() => {
        this.stopEventAnimation();
        window.setTimeout(() => {
          this.doNextAnimation();
        }, 0);
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
      if (this.playerId == null) {
        this.ui.footer.display = false;
        return;
      }

      this.ui.footer.display = true;
      this.ui.footer.observer = this.isObserverMode;
      const character = this.controlledCharacter;
      if (this.isObserverMode) {
        // not this player's turn to act
        this.ui.footer.selectedSkill = null;
        this.ui.footer.itemName = "";
        this.ui.footer.itemDescription = "";
        this.ui.footer.selectedTarget = null;
        this.ui.footer.skills = [];
      } else {
        // it is this player's turn to act
        this.ui.footer.skills = character.skills;
        if (this.ui.footer.selectedSkill != null) {
          const skill = character.skills[this.ui.footer.selectedSkill];
          this.ui.footer.itemName = skill.name;
          this.ui.footer.itemDescription = this.buildSkillDescription(skill);
        } else {
          this.ui.footer.itemName = "";
          this.ui.footer.itemDescription = "Choose a skill."
        }
      }

      if (this.ui.selectedEnemy != null) {
        this.ui.footer.characterData = this.enemies[this.ui.selectedEnemy];
      } else if (this.ui.selectedPlayer != null) {
        this.ui.footer.characterData = this.players[this.ui.selectedPlayer];
      } else {
        this.ui.footer.characterData = this.activeCharacter;
      }
    },

    buildSkillDescription(data) {
      if (data.cooldown <= 0) { return data.description; }
      return `${data.description} [Cooldown: ${data.cooldown}]`;
    },

    onSkillSelected(i) {
      assert(this.ui.state === UIState.CHOOSE_ACTION, `UI state: ${this.ui.state}`);
      const character = this.controlledCharacter;
      const skill = character.skills[i];
      // reset selection
      this.ui.footer.characterData = character;
      this.ui.targetMode = skill.data.target;
      switch (skill.data.target) {
        case targetModeSelf():
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = character.index;
          this.ui.footer.selectedTarget = character.id;
          break;
        case targetModeAlly():
          this.ui.selectedEnemy = null;
          if (this.ui.selectedPlayer == null && this.players.length === 1) {
            this.ui.selectedPlayer = 0;
          }
          this.ui.footer.selectedTarget = this.ui.selectedPlayer;
          break;
        case targetModeEnemy():
          this.ui.selectedPlayer = null;
          if (this.ui.selectedEnemy == null && this.enemies.length === 1) {
            this.ui.selectedEnemy = 0;
          }
          this.ui.footer.selectedTarget = this.ui.selectedEnemy;
          break;
        default:
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = null;
          this.ui.footer.selectedTarget = 0;
      }
      // select or deselect skill
      // this.ui.footer.selectedSkill = (this.ui.footer.selectedSkill == i) ? null : i;
      this.ui.state = UIState.CHOOSE_TARGET;
      this.ui.footer.selectedSkill = i;
      this.resetFooterState();
    },

    onCancelSkill() {
      assert(this.ui.state === UIState.CHOOSE_TARGET, `UI state: ${this.ui.state}`);
      this.ui.state = UIState.CHOOSE_ACTION;
      const character = this.controlledCharacter;
      // reset selection
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      this.resetFooterState();
    },

    onUseSkill() {
      assert(this.ui.state === UIState.CHOOSE_TARGET, `UI state: ${this.ui.state}`);
      const character = this.controlledCharacter;
      const i = this.ui.footer.selectedSkill;
      const t = this.ui.footer.selectedTarget;
      // reset selection
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      // call logic action
      console.log(this.playerId, "selected skill", character.skills[i].id);
      Rune.actions.useSkill({ skill: i, target: t });
      // refresh UI
      this.ui.state = UIState.SYNC;
      this.resetFooterState();
    },

    onEnemySelected(character) {
      const i = character.index;
      if (this.ui.footer.selectedSkill != null) {
        if (this.ui.targetMode == targetModeEnemy()) {
          this.ui.selectedPlayer = null;
          this.ui.selectedEnemy = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        this.ui.selectedPlayer = null;
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
      if (this.ui.footer.selectedSkill != null) {
        if (this.ui.targetMode == targetModeAlly()) {
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        this.ui.selectedEnemy = null;
        if (i == this.ui.selectedPlayer) {
          this.ui.selectedPlayer = null;
          this.ui.footer.characterData = this.thisPlayer;
        } else {
          this.ui.selectedPlayer = i;
          this.ui.footer.characterData = character;
        }
      }
    }

    // refreshSlides() {
    //   const slidesContainer = document.getElementById("slides-container");
    //   const slide = document.querySelector(".slide");
    //   const slideWidth = slide.clientWidth;
    //   slidesContainer.scrollLeft = this.currentTurn * slideWidth;
    // }
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
      // console.log("yourPlayerId:", yourPlayerId);
      // console.log("action:", action);
      // console.log("event:", event);
      // console.log("new game state:", newGame);
      // console.log("rollbacks:", rollbacks);
      if (action == null) {
        // Not a partial update. Might be a post-setup call, for example.
        vueApp.onSetupDone(newGame, yourPlayerId);
      } else {
        vueApp.animateNewGameState(newGame, yourPlayerId);
      }
    },
  });
}
