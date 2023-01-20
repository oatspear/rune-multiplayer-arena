const { createApp } = Vue




const app = createApp({
  data() {
    return {
      playerIndex: 0,
      currentTurn: 0,
      players: [
        newPlayer(0, 'ranger'),
        newPlayer(1, 'warrior'),
        newPlayer(2, 'rogue'),
        newPlayer(3, 'mage')
      ],
      tiles: [
        newRegion(),
        newRegion(),
        newRegion(),
        newRegion()
      ],
      ui: {
        selectedEnemy: null,
        selectedPlayer: null,
        footer: {
          selectedSkill: null,
          characterData: DummyCharacter,
          itemName: "",
          itemDescription: ""
        }
      }
    };
  },
  computed: {
    thisPlayer() {
      return this.players[this.playerIndex];
    }
  },
  methods: {
    resetFooterState() {
      const self = this.thisPlayer;
      if (this.ui.footer.selectedSkill != null) {
        const skill = self.skills[this.ui.footer.selectedSkill];
        this.ui.footer.itemName = skill.data.name;
        this.ui.footer.itemDescription = this.buildSkillDescription(skill.data);
      } else {
        this.ui.footer.itemName = "";
        this.ui.footer.itemDescription = "Choose a skill."
      }
      if (this.ui.selectedEnemy != null) {
        this.ui.footer.characterData = this.tiles[0][this.ui.selectedEnemy];  // FIXME
      } else if (this.ui.selectedPlayer != null) {
        this.ui.footer.characterData = this.players[this.ui.selectedPlayer];
      } else {
        this.ui.footer.characterData = self;
      }
    },

    buildSkillDescription(data) {
      if (data.cooldown <= 0) { return data.description; }
      return `${data.description} [cooldown: ${data.cooldown}]`;
    },

    onUseSkill(i) {
      const self = this.thisPlayer;
      // reset selection
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      this.ui.footer.characterData = self;
      // select or deselect skill
      this.ui.footer.selectedSkill = (this.ui.footer.selectedSkill == i) ? null : i;
      this.resetFooterState();
    },

    onEnemySelected(character) {
      const i = character.index;
      this.ui.selectedPlayer = null;
      if (i == this.ui.selectedEnemy) {
        this.ui.selectedEnemy = null;
        this.ui.footer.characterData = this.thisPlayer;
      } else {
        this.ui.selectedEnemy = i;
        this.ui.footer.characterData = character;
      }
    },

    onPlayerSelected(character) {
      const i = character.index;
      this.ui.selectedEnemy = null;
      if (i == this.ui.selectedPlayer) {
        this.ui.selectedPlayer = null;
        this.ui.footer.characterData = this.thisPlayer;
      } else {
        this.ui.selectedPlayer = i;
        this.ui.footer.characterData = character;
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
    this.resetFooterState();
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
