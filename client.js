// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const { createApp } = Vue

const app = createApp({
  data() {
    return {
      playerIndex: 0,
      currentTurn: 0,
      players: [
        newPlayer(0, 1),
        newPlayer(1, 2),
        newPlayer(2, 3),
        newPlayer(3, 4)
      ],
      tiles: [
        newRegion(),
        newRegion(),
        newRegion(),
        newRegion()
      ],
      ui: {
        targetMode: null,
        selectedEnemy: null,
        selectedPlayer: null,
        footer: {
          selectedSkill: null,
          selectedTarget: null,
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
    },

    highlightEnemies() {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == TargetMode.ENEMY;
    },

    highlightPlayers() {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == TargetMode.ALLY;
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
      return `${data.description} [Cooldown: ${data.cooldown}]`;
    },

    onSkillSelected(i) {
      const self = this.thisPlayer;
      const skill = self.skills[i];
      // reset selection
      this.ui.footer.characterData = self;
      this.ui.targetMode = skill.data.target;
      switch (skill.data.target) {
        case TargetMode.SELF:
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = self.index;
          this.ui.footer.selectedTarget = self.index;
          break;
        case TargetMode.ALLY:
          this.ui.selectedEnemy = null;
          this.ui.footer.selectedTarget = this.ui.selectedPlayer;
          break;
        case TargetMode.ENEMY:
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
      Rune.actions.useSkill({ skill: i, target: t });
    },

    onEnemySelected(character) {
      const i = character.index;
      this.ui.selectedPlayer = null;
      if (this.ui.footer.selectedSkill != null) {
        if (this.ui.targetMode == TargetMode.ENEMY) {
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
        if (this.ui.targetMode == TargetMode.ALLY) {
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

/*******************************************************************************
  Rune Setup
*******************************************************************************/

function render() {
  // TODO
}

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
    render(newGame);
  },
});
