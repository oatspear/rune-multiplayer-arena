const { createApp } = Vue


function newSkill(id, name, cooldown = 0, icon = "skill", description = "") {
  return {
    id: id,
    name: name,
    cooldown: cooldown,
    icon: icon,
    description: description
  };
}


const Skills = [
  newSkill(0, "Rest", 0, "rest", "Recover some health.")
];


function newSkillInstance(data) {
  return {
    data: data,
    cooldown: data.cooldown
  };
}


function newCharacterClass(id, name, power = 0, health = 0) {
  return {
    id: id,
    name: name,
    power: power,
    health: health,
    skills: [0, 0, 0, 0],
  };
}


const Classes = {
  "": newCharacterClass("", ""),
  "ranger": newCharacterClass("ranger", "Ranger", 12, 20),
  "warrior": newCharacterClass("warrior", "Warrior", 10, 22),
  "rogue": newCharacterClass("rogue", "Rogue", 14, 18),
  "mage": newCharacterClass("mage", "Mage", 14, 18),
  "boss": newCharacterClass("boss", "Boss", 5, 30)
};


function newCharacter(i, name, classId) {
  const cls = Classes[classId];
  const skills = [];
  for (let i = 0; i < cls.skills.length; ++i) {
    const data = Skills[cls.skills[i]];
    skills.push(newSkillInstance(data));
  }
  return {
    index: i,
    name: name,
    power: cls.power,
    health: cls.health,
    currentHealth: cls.health,
    characterClass: cls,
    skills: skills
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

const DummyCharacter = newCharacter(0, "", "");

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
