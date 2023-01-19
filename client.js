const { createApp } = Vue


function newCharacterClass(id, name) {
  return {
    id: id,
    name: name
  };
}


const Classes = {
  "ranger": newCharacterClass("ranger", "Ranger"),
  "warrior": newCharacterClass("warrior", "Warrior"),
  "rogue": newCharacterClass("rogue", "Rogue"),
  "mage": newCharacterClass("mage", "Mage"),
  "boss": newCharacterClass("boss", "Boss")
};


function newCharacter(i, name, cls) {
  return {
    index: i,
    name: name,
    power: 12,
    health: 20,
    currentHealth: 20,
    characterClass: Classes[cls]
  };
}


function newRegion() {
  return [
    newCharacter(0, "Unnamed Boss", "boss"),
    newCharacter(1, "Unnamed Boss", "boss"),
    newCharacter(2, "Unnamed Boss", "boss"),
    newCharacter(3, "Unnamed Boss", "boss"),
  ];
}


function newPlayer(i, cls) {
  c = newCharacter(i, `Player ${i+1}`, cls)
  c.gold = (i+1)*2;
  return c;
}

const app = createApp({
  data() {
    return {
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
app.component("BattleScene", BattleScene);
app.component("BattleTile", BattleTile);
app.component("BattleFooter", BattleFooter);
app.component("BattlePlayerInfo", BattlePlayerInfo);
app.component("BattleActionBar", BattleActionBar);
app.component("BattleIconLabel", BattleIconLabel);

app.mount("#app");
