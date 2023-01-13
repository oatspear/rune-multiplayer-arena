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
      const i = ((Math.random() * 9) | 0) + 1;
      const tile = this.tiles[0][0];
      if (tile.ghouls >= 3) {
        tile.ghouls = 0;
      } else {
        tile.ghouls++;
      }
    }
  }
});

app.component("BattleHeader", BattleHeader);
app.component("BattleRegion", BattleRegion);
app.component("BattleTile", BattleTile);
app.component("BattleMinionCounter", BattleMinionCounter);
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
