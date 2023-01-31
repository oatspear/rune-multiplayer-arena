// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const BattleBoard = {
  template: "#vue-battle-board",
  props: {
    uiState: {
      type: String,
      required: true
    },
    enemies: {
      type: Array,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    playerId: String,
    highlightEnemies: Boolean,
    highlightPlayers: Boolean,
    selectedEnemy: Number,
    selectedPlayer: Number
  },
  data() {},
  methods: {
    onEnemySelected(character) {
      this.$emit("selected-enemy", character);
    },

    onPlayerSelected(character) {
      this.$emit("selected-player", character);
    },

    onCharacterAnimationFinished(character) {
      this.$emit("animation-finished", character);
    }
  }
};


const BattleScene = {
  template: "#vue-battle-scene",
  props: {
    sceneIndex: {
      type: Number,
      required: true
    },
    enemies: {
      type: Array,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    playerId: String,
    highlightEnemies: Boolean,
    highlightPlayers: Boolean,
    selectedEnemy: Number,
    selectedPlayer: Number
  },

  data() {
    return {};
  },

  methods: {
    onEnemySelected(i) {
      const character = this.enemies[i];
      this.$emit("selected-enemy", character);
    },

    onPlayerSelected(i) {
      const character = this.players[i];
      this.$emit("selected-player", character);
    },

    onCharacterAnimationFinished(character) {
      this.$emit("animation-finished", character);
    }
  }
};


const BattleCharacter = {
  template: "#vue-battle-character",
  props: {
    tileIndex: {
      type: Number,
      required: true
    },
    character: {
      type: Object,
      required: true
    },
    isEnemy: Boolean,
    isActive: Boolean,
    isHighlighted: Boolean,
    isOwned: Boolean
  },

  data() {
    return {
      power: this.character.power,
      health: this.character.health,
      currentHealth: this.character.currentHealth,
      animation: "",
      overlay: {
        display: false,
        icon: null,
        animation: "",
        label: {
          animation: "",
          style: "",
          value: ""
        }
      }
    };
  },

  watch: {
    'character.animation'(newValue, oldValue) {
      if (newValue == null) {
        this.animation = "";
        // this.overlay.display = false;
        // this.overlay.icon = "";
        // this.overlay.animation = "";
        // this.overlay.particles = "";
        // this.overlay.particleAnimation = "";
        return;
      }
      switch (newValue.type) {
        case "damage":
          return this.animateDamage(newValue);
        case "heal":
          return this.animateHealing(newValue);
      }
    }
  },

  methods: {
    onTileClick() {
      this.$emit("selected", this.tileIndex);
    },

    animateDamage(params) {
      this.animation = "damage";
      this.overlay.display = true;
      this.overlay.icon = "willpower";
      this.overlay.animation = "shaking";
      // window.setTimeout(() => {
      //   this.overlay.display = false;
      //   this.overlay.icon = "";
      //   this.overlay.animation = "";
      // }, 800);

      // this.$emit("animation-started");
      // await this.showTimedOverlayNumber(-params.value);
      // await this.fadeOverlay();
      // this.currentHealth -= params.value;
      // this.$emit("animation-finished", this.character);
    },

    animateHealing(params) {
      this.animation = "heal";
      this.overlay.display = true;
      this.overlay.particles = "heal";
      this.overlay.particleAnimation = "floating";
      // window.setTimeout(() => {
      //   this.overlay.display = false;
      //   this.overlay.icon = "";
      //   this.overlay.animation = "";
      // }, 800);

      // this.$emit("animation-started");
      // await this.showTimedOverlayNumber(params.value);
      // await this.fadeOverlay();
      // this.currentHealth += params.value;
      // if (this.currentHealth >= this.health) {
      //   this.currentHealth = this.health;
      // }
      // this.$emit("animation-finished", this.character);
    },

    showTimedOverlayNumber(value) {
      return new Promise(resolve => {
        this.overlay.display = true;
        if (value < 0) {
          this.overlay.label.style = "negative";
          this.overlay.label.value = `-${-value}`;
        } else if (value > 0) {
          this.overlay.label.style = "positive";
          this.overlay.label.value = `+${value}`;
        } else {
          this.overlay.label.style = "";
          this.overlay.label.value = "0";
        }
        window.setTimeout(() => {
          resolve();
        }, 500);
      });
    },

    fadeOverlay() {
      return new Promise(resolve => {
        this.overlay.label.animation = "fade";
        window.setTimeout(() => {
          this.overlay.display = false;
          resolve();
        }, 300);
      });
    }
  }
};


const BattleHeader = {
  template: "#vue-battle-header",
  props: {
    history: {
      type: Array,
      required: true
    }
  }
};


const BattleHistoryEvent = {
  template: "#vue-battle-history-event",

  props: {
    currentEvent: Object
  },

  data() {
    return {
      event: this.currentEvent,
      transition: false
    };
  },

  computed: {
    shouldDisplay() { return this.event != null && !this.transition; }
  },

  watch: {
    currentEvent(newValue, oldValue) {
      if (!this.transition) {
        console.log("triggered history event transition");
        this.transition = true;
        window.setTimeout(() => {
          console.log("history event transition done");
          this.event = this.currentEvent;
          this.transition = false;
        }, 300);
      }
    }
  },

  methods: {
    onHistoryEventClicked() {
      console.log("check history event:", this.event);
    }
  }
};


const BattleFooter = {
  template: "#vue-battle-footer",
  props: {
    characterData: {
      type: Object,
      required: true
    },
    skills: {
      type: Array,
      required: true
    },
    selectedSkill: Number,
    selectedTarget: Number,
    itemName: String,
    itemDescription: String
  },
  methods: {
    onSkillSelected(i) {
      this.$emit("select-skill", i);
    },

    onCancelSkill() {
      this.$emit("cancel-skill");
    },

    onUseSkill() {
      this.$emit("use-skill");
    }
  }
};


const BattlePlayerInfo = {
  template: "#vue-battle-player-info",
  props: {
    displayName: {
      type: String,
      default: ""
    },
    classIcon: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    },
    powerValue: {
      type: Number,
      default: 0
    },
    healthValue: {
      type: Number,
      default: 0
    }
  }
};


const BattleActionBar = {
  template: "#vue-battle-action-bar",
  props: {
    skills: {
      type: Array,
      required: true
    },
    selectedSkill: Number,
    selectedTarget: Number
  },
  methods: {
    selectSkill(i) {
      this.$emit("select-skill", i);
    },

    cancelSkill() {
      this.$emit("cancel-skill");
    },

    useSkill() {
      this.$emit("use-skill");
    }
  }
};


const BattleIconLabel = {
  template: "#vue-battle-icon-label",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 32
    }
  }
};
