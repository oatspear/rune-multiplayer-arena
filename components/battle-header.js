const BattleHeaderTemplate = `
  <header @click="battleUpdate">{{ message }}</header>
`;

const BattleHeader = {
  data() {
    return {
      message: "Imported header"
    }
  },
  template: BattleHeaderTemplate,
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
