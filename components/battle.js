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
    }
  }
};


const BattleTile = {
  template: "#vue-battle-tile",
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
    return {};
  },
  methods: {
    onTileClick() {
      this.$emit("selected", this.tileIndex);
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
