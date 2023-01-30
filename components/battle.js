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


const BattleHeader = {
  template: "#vue-battle-header",
  props: {
    currentTurn: {
      type: Number,
      required: true
    },
    numPlayers: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    battleUpdate() {}
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
      overlayLabel: {
        display: false,
        animation: "",
        style: "",
        value: ""
      }
    };
  },

  watch: {
    'character.animation'(newValue, oldValue) {
      if (newValue == null) { return; }
      switch (newValue.type) {
        case "damage":
          return this.animateDamage(newValue);
      }
    }
  },

  methods: {
    onTileClick() {
      this.$emit("selected", this.tileIndex);
    },

    animateDamage: async function (params) {
      this.$emit("animation-started");
      this.currentHealth = params.startingHealth;
      await this.showTimedOverlayNumber(-params.value);
      await this.fadeOverlay();
      this.currentHealth = params.finalHealth;
      this.$emit("animation-finished", this.character);
    },

    showTimedOverlayNumber(value) {
      return new Promise(resolve => {
        this.overlayLabel.display = true;
        if (value < 0) {
          this.overlayLabel.style = "negative";
          this.overlayLabel.value = `-${-value}`;
        } else if (value > 0) {
          this.overlayLabel.style = "positive";
          this.overlayLabel.value = `+${value}`;
        } else {
          this.overlayLabel.style = "";
          this.overlayLabel.value = "0";
        }
        window.setTimeout(() => {
          resolve();
        }, 500);
      });
    },

    fadeOverlay() {
      return new Promise(resolve => {
        this.overlayLabel.animation = "fade";
        window.setTimeout(() => {
          resolve();
        }, 300);
      });
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
