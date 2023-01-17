const { createApp } = Vue

function newTile() {
  return {
    ghouls: 0,
    abominations: 0
  };
}

function newRegion() {
  return [
    newTile(),
    newTile(),
    newTile(),
    newTile(),
    newTile(),
    newTile(),
    newTile(),
    newTile(),
    newTile()
  ];
}

function newPlayer(i, cls) {
  return {
    index: i,
    name: `Player ${i+1}`,
    health: 8,
    currentHealth: (i+1)*2,
    gold: (i+1)*2,
    playerClass: cls
  };
}

const app = createApp({
  data() {
    return {
      currentTurn: 0,
      players: [
        newPlayer(0, 'archer'),
        newPlayer(1, 'warrior'),
        newPlayer(2, 'rogue'),
        newPlayer(3, 'mage')
      ],
      tiles: [
        newRegion(),
        newRegion(),
        newRegion(),
        newRegion()
      ]
    };
  },
  methods: {
    onSpawnGhouls() {
      const region = this.tiles[0];
      const i = (Math.random() * region.length) | 0;
      const tile = region[i];
      if (tile.ghouls >= 3) {
        tile.ghouls = 0;
      } else {
        tile.ghouls++;
      }
    },

    onSpawnAbomination() {
      const region = this.tiles[0];
      const i = (Math.random() * region.length) | 0;
      const tile = region[i];
      tile.abominations++;
    },

    incrementTurn() {
      if (this.currentTurn < (this.players.length - 1)) {
        this.currentTurn++;
        this.refreshSlides();
      }
    },

    decrementTurn() {
      if (this.currentTurn > 0) {
        this.currentTurn--;
        this.refreshSlides();
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
    this.refreshSlides();
  }
});

app.component("BattleBoard", BattleBoard);
app.component("BattleHeader", BattleHeader);
app.component("BattleRegion", BattleRegion);
app.component("BattleTile", BattleTile);
app.component("BattleMinionCounter", BattleMinionCounter);
app.component("BattleMonsterCounter", BattleMonsterCounter);
app.component("BattleFooter", BattleFooter);
app.component("BattlePlayerInfo", BattlePlayerInfo);
app.component("BattleIconLabel", BattleIconLabel);

app.mount("#app");
