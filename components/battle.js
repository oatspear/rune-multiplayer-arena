const BattleHeader = {
  template: "#vue-battle-header",
  props: {
    currentTurn:  {
      type: Number,
      required: true
    },
    numPlayers:  {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      message: "Imported header"
    }
  },
  methods: {
    battleUpdate() {
      this.message = "Updated header";
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    // this.increment()
    console.log("header is mounted");
  }
};


const BattleFooter = {
  template: "#vue-battle-footer",
  props: {
    playerData:  {
      type: Object,
      required: true
    }
  },
  methods: {
    spawnGhouls() {
      this.$emit("spawnGhouls");
    },
    spawnAbomination() {
      this.$emit("spawnAbomination");
    },
    showNextPlayer() {
      this.$emit("showNextPlayer");
    },
    showPreviousPlayer() {
      this.$emit("showPreviousPlayer");
    }
  }
};


const BattleRegion = {
  template: "#vue-battle-region",
  props: {
    regionIndex:  {
      type: Number,
      required: true
    },
    tiles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    battleUpdate() {
      this.message = "Updated header";
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    // this.increment()
    console.log("battle region is mounted:", this.regionIndex);
  }
};


const BattleTile = {
  template: "#vue-battle-tile",
  props: {
    regionIndex: {
      type: Number,
      required: true
    },
    tileIndex: {
      type: Number,
      required: true
    },
    tileData: {
      type: Object,
      required: true
    },
    isBoss: Boolean,
    isStronghold: Boolean
  },
  data() {
    return {
      isActive: false,
      minions: 0,
      monsters: 0
    }
  },
  methods: {
    onTileClick() {
      // this.isActive = !this.isActive;
      if (this.minions >= 3) {
        this.minions = 0;
      } else {
        this.minions++;
      }
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    // this.increment()
    console.log("battle tile is mounted:", this.regionIndex, this.tileIndex);
  }
};


const BattleMinionCounter = {
  template: "#vue-battle-minion-counter",
  props: {
    count: {
      type: Number,
      required: true
    }
  }
};

const BattleMonsterCounter = {
  template: "#vue-battle-monster-counter",
  props: {
    count: {
      type: Number,
      required: true
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
    }
  }
};
