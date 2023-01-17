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

const app = createApp({
  data() {
    return {
      currentTurn: 0,
      numPlayers: 4,
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
    }
  }
});

app.component("BattleIconLabel", BattleIconLabel);
app.component("BattleHeader", BattleHeader);
app.component("BattleRegion", BattleRegion);
app.component("BattleTile", BattleTile);
app.component("BattleMinionCounter", BattleMinionCounter);
app.component("BattleMonsterCounter", BattleMonsterCounter);
app.component("BattleFooter", BattleFooter);

app.mount("#app");

const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
});

prevButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
});
