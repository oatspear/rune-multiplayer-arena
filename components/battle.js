// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const BattleBoard = {
  template: "#vue-battle-board",
  props: {
    enemies: {
      type: Array,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    isBattleState: Boolean,
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
        iconAnimation: null,
        particles: null,
        particleAnimation: null,
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
        this.overlay.display = false;
        this.overlay.icon = null;
        this.overlay.iconAnimation = null
        this.overlay.particles = null;
        this.overlay.particleAnimation = null;
        if (oldValue.finalHealth != null) {
          this.currentHealth = oldValue.finalHealth;
        }
        if (oldValue.finalPower != null) {
          this.power = oldValue.finalPower;
        }
      } else {
        this.animateEvent(newValue);
      }
    }
  },

  methods: {
    onTileClick() {
      this.$emit("selected", this.tileIndex);
    },

    animateEvent(params) {
      this.animation = params.type;
      const data = BattleEvents[params.type];
      if (data == null || data.animation == null) { return; }
      const animationData = data.animation;

      this.overlay.display = true;
      if (animationData.icon != null) {
        this.overlay.icon = animationData.icon.name;
        this.overlay.iconAnimation = animationData.icon.animation;
      }
      if (animationData.particles != null) {
        this.overlay.particles = animationData.particles.name;
        this.overlay.particleAnimation = animationData.particles.animation;
      }

      if (params.startingHealth != null) {
        this.currentHealth = params.startingHealth;
      }
      if (params.startingPower != null) {
        this.power = params.startingPower;
      }
    }

    // showTimedOverlayNumber(value) {
    //   return new Promise(resolve => {
    //     this.overlay.display = true;
    //     if (value < 0) {
    //       this.overlay.label.style = "negative";
    //       this.overlay.label.value = `-${-value}`;
    //     } else if (value > 0) {
    //       this.overlay.label.style = "positive";
    //       this.overlay.label.value = `+${value}`;
    //     } else {
    //       this.overlay.label.style = "";
    //       this.overlay.label.value = "0";
    //     }
    //     window.setTimeout(() => {
    //       resolve();
    //     }, 500);
    //   });
    // },

    // fadeOverlay() {
    //   return new Promise(resolve => {
    //     this.overlay.label.animation = "fade";
    //     window.setTimeout(() => {
    //       this.overlay.display = false;
    //       resolve();
    //     }, 300);
    //   });
    // }
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
      transition: false,
      icon: null
    };
  },

  computed: {
    shouldDisplay() { return this.event != null && !this.transition; },
    isHostile() { return this.event.user != null && this.event.user < 0; },
    isFriendly() { return this.event.user != null && this.event.user >= 0; }
  },

  watch: {
    currentEvent(newValue, oldValue) {
      if (!this.transition) {
        this.transition = true;
        window.setTimeout(() => {
          this.event = this.currentEvent;
          this.transition = false;
          let data = BattleEvents[this.event.type];
          if (this.event.type === "skill") {
            data = Skills[this.event.skill];
          }
          if (data != null) {
            this.icon = data.icon;
          }
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
    itemDescription: String,
    observer: Boolean
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
    observer: {
      type: String,
      default: ""
    },
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
