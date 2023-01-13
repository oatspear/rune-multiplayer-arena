const BattleHeader = {
  data() {
    return {
      message: "Imported header"
    }
  },
  template: "#vue-battle-header",
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
  template: "#vue-battle-footer"
};


const BattleRegion = {
  props: {
    regionIndex:  {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      message: "Imported header"
    }
  },
  template: "#vue-battle-region",
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
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    onTileClick() {
      this.isActive = !this.isActive;
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    // this.increment()
    console.log("battle tile is mounted:", this.regionIndex, this.tileIndex);
  }
};
