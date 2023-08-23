<script lang="ts">
// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import { Player, Players } from "rune-games-sdk";
import HelloWorld from "./components/HelloWorld.vue"
import {
  BattleEvent,
  CharacterInstance,
  GameState,
  Maybe,
  PlayerCharacterInstance,
  SKillBattleEvent,
  SkillInstance,
  TARGET_MODE_ALLY,
  TARGET_MODE_ENEMY,
  TargetedBattleEvent,
  TargetMode
} from "./logic";
import { ClientClassData, ClientClasseDataMap, ClientSkillDataMap } from "./data";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_ANIM_DURATION = 1000;


enum UIState {
  INIT,
  BATTLE_SETUP,
  CHOOSE_ACTION,
  CHOOSE_TARGET,
  SYNC,
  ANIMATION,
  AWAITING_PLAYER_ACTION,
}


// -----------------------------------------------------------------------------
// Utility
// -----------------------------------------------------------------------------


function assert(condition: boolean, message: Maybe<string> = undefined): void {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


// -----------------------------------------------------------------------------
// Character Skills
// -----------------------------------------------------------------------------


interface ClientSkill extends SkillInstance {
  name: string;
  icon: string;
  description: string;
}


function newClientSkill(skillInstance: SkillInstance): ClientSkill {
  const meta = ClientSkillDataMap[skillInstance.data.id];
  // NOTE: `skill.data` is shared! `Object.assign` is a shallow copy.
  const skill = Object.assign({}, skillInstance);
  return Object.assign(skill, meta);
}


// -----------------------------------------------------------------------------
// Player Characters
// -----------------------------------------------------------------------------


interface ClientCharacterInstance {
  id: number;
  index: number;
  playerId: string;
  name: string;
  portrait: string;
  hasUIData: boolean;
  classData: ClientClassData,
  power: number;
  health: number;
  currentHealth: number;
  skills: ClientSkill[],
  animation: string | null;
  stunned: number;
  shield: number;
  poison: number;
  healing: number;
  invulnerable: number;
  healingModifier: number;
  armorModifier: number;
}


function newClientPlayer(data: CharacterInstance, index: number, uiInfo: Maybe<Player> = undefined): ClientCharacterInstance {
  const cls = ClientClasseDataMap[data.classId];
  const skills = data.skills.map(newClientSkill);
  // for (const skill of data.skills) {
  //   // skills.push(newClientSkill(s.id));
  //   skills.push(newClientSkill(skill));
  // }
  let displayName = cls.name;
  let portrait = `assets/${cls.icon}.png`;
  if (uiInfo != null) {
    displayName = uiInfo.displayName || displayName;
    portrait = uiInfo.avatarUrl || portrait;
  }
  // uiInfo != null ? uiInfo.avatarUrl : "assets/avatar-placeholder.png"
  return {
    id: data.id,
    index: index,
    playerId: data.playerId,
    name: displayName,
    portrait: portrait,
    hasUIData: uiInfo != null,
    classData: cls,
    // speed: data.speed,
    power: data.power,
    health: data.health,
    currentHealth: data.currentHealth,
    skills: skills,
    animation: null,
    stunned: data.effects.stunned,
    shield: data.effects.shield,
    poison: data.effects.poison,
    healing: data.effects.healing,
    invulnerable: data.effects.invulnerable,
    healingModifier: data.effects.healingModifier,
    armorModifier: data.effects.armorModifier
  };
}


// -----------------------------------------------------------------------------
// Enemy Characters
// -----------------------------------------------------------------------------


function newClientEnemy(data: CharacterInstance, index: number): ClientCharacterInstance {
  return newClientPlayer(data, index);  // FIXME
}


// -----------------------------------------------------------------------------
// Animations
// -----------------------------------------------------------------------------


interface AnimationSequence {
  events: BattleEvent[];
  finalState: GameState;
  playerId: Maybe<string>;
}


function newAnimationSequence(game: GameState, playerId: Maybe<string>): AnimationSequence {
  const events: BattleEvent[] = [];
  if (game.events.length > 0) {
    Array.prototype.push.apply(events, game.events);
  }
  return {
    events: events,
    finalState: game,
    playerId: playerId
  };
}


// -----------------------------------------------------------------------------
// Game Client
// -----------------------------------------------------------------------------


interface ClientData {
  playerId: Maybe<string>;
  currentTurn: number;
  enemies: ClientCharacterInstance[];
  players: ClientCharacterInstance[];
  characters: {
    [id: number]: ClientCharacterInstance;
  };
  history: Array<BattleEvent | null>;
  eventQueue: BattleEvent[];
  ui: {
    state: UIState;
    playerData: Players;
    compact: boolean;
    targetMode: TargetMode | null;
    selectedEnemy: number | null;
    selectedPlayer: number | null;
    actingCharacter: number | null;
    footer: {
      display: boolean;
      observer: boolean;
      selectedSkill: number | null;
      selectedTarget: number | null;
      characterData: ClientCharacterInstance | null;
      skills: ClientSkill[];
      itemName: string;
      itemDescription: string;
    },
    isAnimating: boolean;
    animationQueue: AnimationSequence[];
    globalAnimation: string;
  }
}


export default {
  data(): ClientData {
    return {
      playerId: undefined,
      currentTurn: 0,
      enemies: [],
      players: [],
      characters: {},
      history: [null, null, null, null],
      eventQueue: [],
      ui: {
        state: UIState.INIT,
        playerData: {},
        compact: false,
        targetMode: null,
        selectedEnemy: null,
        selectedPlayer: null,
        actingCharacter: null,
        footer: {
          display: false,
          observer: true,
          selectedSkill: null,
          selectedTarget: null,
          characterData: null,
          skills: [],
          itemName: "",
          itemDescription: ""
        },
        isAnimating: false,
        animationQueue: [],
        globalAnimation: ""
      }
    };
  },

  computed: {
    activeCharacter(): ClientCharacterInstance | null {
      return this.characters[this.currentTurn] || null;
    },

    controlledCharacter(): ClientCharacterInstance | null {
      if (this.playerId == null) { return null; }
      const character = this.characters[this.currentTurn];
      if (character == null) { return null; }
      return this.playerId === character.playerId ? character : null;
    },

    isSetupState(): boolean {
      return this.ui.state === UIState.BATTLE_SETUP;
    },

    isBattleState(): boolean {
      return this.ui.state != UIState.INIT && this.ui.state != UIState.BATTLE_SETUP;
    },

    isObserverMode(): boolean {
      if (this.playerId == null) { return true; }
      const state = this.ui.state;
      if (state === UIState.CHOOSE_ACTION) { return false; }
      if (state === UIState.CHOOSE_TARGET) { return false; }
      return true;
    },

    highlightEnemies(): boolean {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == TARGET_MODE_ENEMY;
    },

    highlightPlayers(): boolean {
      return this.ui.selectedEnemy == null
        && this.ui.footer.selectedTarget == null
        && this.ui.targetMode == TARGET_MODE_ALLY;
    }
  },

  methods: {
    onSetupDone(game: GameState, playerId: Maybe<string>, players: Players): void {
      // assert(this.ui.state === UIState.INIT, `UI state: ${this.ui.state}`);
      this.ui.playerData = players;
      this.setGameState(game, playerId);
      this.ui.globalAnimation = "anim-battle-start";
      window.setTimeout(() => { this.setActionUIState(); }, 2000);
      // this.enterChooseCharacterUIState();
    },

    setActionUIState(): void {
      const character = this.controlledCharacter;
      if (character != null) {
        this.enterChooseActionState();
      } else {
        this.enterAwaitPlayerState();
      }
      this.ui.globalAnimation = "";
    },

    setGameState(game: GameState, playerId: Maybe<string>): void {
      // Hard reset of the current game state
      console.log("setGameState()");
      this.playerId = playerId;
      this.ui.state = UIState.BATTLE_SETUP;
      this.enemies = [newClientEnemy(game.enemy, 0)];
      this.setPlayerStates(game.players);
      this.resetCharacterMap();
      this.currentTurn = game.currentTurn;
      this.eventQueue = game.events;
    },

    setPlayerStates(players: PlayerCharacterInstance[]): void {
      this.players = [];
      for (let i = 0; i < players.length; ++i) {
        const ui = this.ui.playerData[players[i].playerId];
        this.players.push(newClientPlayer(players[i], i, ui));
      }
      this.ui.compact = this.players.length > 2;
    },

    resetCharacterMap(): void {
      this.characters = {};
      for (const c of this.enemies) {
        this.characters[c.id] = c;
      }
      for (const c of this.players) {
        this.characters[c.id] = c;
      }
    },

    animateNewGameState(game: GameState, playerId: Maybe<string>): void {
      console.log("animateNewGameState()");
      this.ui.animationQueue.push(newAnimationSequence(game, playerId));
      if (!this.ui.isAnimating) {
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      }
    },

    doNextAnimation(): boolean {
      if (this.ui.isAnimating) { return false; }
      if (this.ui.animationQueue.length === 0) {
        // No more animations. Reset UI state.
        this.setActionUIState();
        return false;
      }
      const sequence = this.ui.animationQueue[0];
      console.log("begin animation sequence", sequence);
      if (this.ui.state != UIState.ANIMATION) {
        this.enterAnimationState();
      }
      if (sequence.events.length === 0) {
        // Reached the end of this animation sequence
        this.ui.animationQueue.splice(0, 1);
        this.setGameState(sequence.finalState, sequence.playerId);
        window.setTimeout(() => { this.doNextAnimation(); }, 0);
      } else {
        // Animate the next event
        const event = sequence.events.splice(0, 1)[0];
        this.animateEvent(event);
      }
      return true;
    },

    animateEvent(event: BattleEvent): void {
      console.log("animateEvent:", event);
      this.ui.isAnimating = true;

      if (event.type === "skill") {
        const ev: SKillBattleEvent = event as SKillBattleEvent;
        this.history.splice(0, 1);
        this.history.push(ev);
        this.ui.actingCharacter = ev.user;
      } else {
        const ev: TargetedBattleEvent = event as TargetedBattleEvent;
        const i = ev.target;
        if (i != null) {
          const character = i >= 0 ? this.players[i] : this.enemies[-i - 1];
          character.animation = event.type;
        } else {
          // FIXME e.g. notification-type event or death
        }
      }
      window.setTimeout(() => {
        this.stopEventAnimation();
        window.setTimeout(() => {
          this.doNextAnimation();
        }, 0);
      }, DEFAULT_ANIM_DURATION);
    },

    stopEventAnimation(): void {
      this.ui.isAnimating = false;
      for (const character of this.enemies) {
        character.animation = null;
      }
      for (const character of this.players) {
        character.animation = null;
      }
    },

    buildSkillDescription(data: ClientSkill): string {
      if (data.cooldown <= 0) { return data.description; }
      return `${data.description} [Cooldown: ${data.cooldown}]`;
    },

    onSkillSelected(i: any): void {
      assert(this.ui.state === UIState.CHOOSE_ACTION, `UI state: ${this.ui.state}`);
      this.enterChooseTargetState(i);
    },

    onCancelSkill(): void {
      assert(this.ui.state === UIState.CHOOSE_TARGET, `UI state: ${this.ui.state}`);
      // transition back to skill selection
      this.enterChooseActionState();
    },

    onUseSkill(): void {
      assert(this.ui.state === UIState.CHOOSE_TARGET, `UI state: ${this.ui.state}`);
      const i = this.ui.footer.selectedSkill;
      const t = this.ui.footer.selectedTarget;
      assert(i != null);
      assert(t != null);

      // refresh UI
      this.enterSyncState();

      // call logic action
      console.log(this.playerId, "selected skill", i);
      Rune.actions.useSkill({ skill: i as number, target: t as number });
    },

    onEnemySelected(character: ClientCharacterInstance): void {
      if (this.ui.state === UIState.ANIMATION) { return; }
      if (character.currentHealth <= 0) { return; }
      const i = character.index;
      // if (this.ui.footer.selectedSkill != null)
      if (this.ui.state === UIState.CHOOSE_TARGET) {
        if (this.ui.targetMode === TARGET_MODE_ENEMY) {
          this.ui.selectedPlayer = null;
          this.ui.selectedEnemy = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        this.ui.selectedPlayer = null;
        if (i === this.ui.selectedEnemy) {
          this.ui.selectedEnemy = null;
          this.ui.footer.characterData = this.activeCharacter;
        } else {
          this.ui.selectedEnemy = i;
          this.ui.footer.characterData = character;
        }
      }
    },

    onPlayerSelected(character: ClientCharacterInstance): void {
      if (this.ui.state === UIState.ANIMATION) { return; }
      if (character.currentHealth <= 0) { return; }
      const i = character.index;
      // if (this.ui.footer.selectedSkill != null)
      if (this.ui.state === UIState.CHOOSE_TARGET) {
        if (this.ui.targetMode === TARGET_MODE_ALLY) {
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = i;
          this.ui.footer.selectedTarget = i;
          // this.ui.footer.characterData = character;
        } else {
          // do nothing or display error message
        }
      } else {
        this.ui.selectedEnemy = null;
        if (i === this.ui.selectedPlayer) {
          this.ui.selectedPlayer = null;
          this.ui.footer.characterData = this.activeCharacter;
        } else {
          this.ui.selectedPlayer = i;
          this.ui.footer.characterData = character;
        }
      }
    },

    // onSetupCharacterSelected() {
    //   const character = this.controlledCharacter;  // FIXME
    //   console.log(this.playerId, "selected", character.classId, "class");
    //   Rune.actions.selectCharacter({ classId: character.classId });
    // },

    // enterChooseCharacterUIState() {
    //   this.ui.state = UIState.BATTLE_SETUP;
    //   this.ui.targetMode = null;
    //   this.ui.selectedEnemy = null;
    //   this.ui.selectedPlayer = null;
    //   this.ui.actingCharacter = null;
    //   this.ui.footer.display = false;
    //   this.ui.footer.observer = false;
    //   this.ui.footer.characterData = null;
    //   this.ui.footer.selectedSkill = null;
    //   this.ui.footer.selectedTarget = null;
    //   this.ui.footer.skills = [];
    //   this.ui.footer.itemName = "";
    //   this.ui.footer.itemDescription = "";
    // },

    enterChooseActionState(): void {
      this.ui.state = UIState.CHOOSE_ACTION;
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      const character = this.controlledCharacter;
      this.ui.actingCharacter = null;
      this.ui.footer.display = true;
      this.ui.footer.observer = false;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      this.ui.footer.skills = !!character ? character.skills : [];
      this.ui.footer.itemName = "";
      this.ui.footer.itemDescription = "Choose a skill.";
    },

    enterChooseTargetState(i: number) {
      const character = this.controlledCharacter;
      const skill = character.skills[i];
      this.ui.state = UIState.CHOOSE_TARGET;
      this.ui.targetMode = skill.data.target;
      // this.ui.actingCharacter = character.id;
      this.ui.footer.display = true;
      this.ui.footer.observer = false;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = i;
      // this.ui.footer.skills = character.skills;
      this.ui.footer.itemName = skill.name;
      this.ui.footer.itemDescription = this.buildSkillDescription(skill);

      switch (skill.data.target) {
        case targetModeSelf():
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = character.index;
          this.ui.footer.selectedTarget = character.id;
          break;
        case TARGET_MODE_ALLY:
          this.ui.selectedEnemy = null;
          if (this.ui.selectedPlayer == null && this.players.length === 1) {
            this.ui.selectedPlayer = 0;
          }
          this.ui.footer.selectedTarget = this.ui.selectedPlayer;
          break;
        case TARGET_MODE_ENEMY:
          this.ui.selectedPlayer = null;
          if (this.ui.selectedEnemy == null && this.enemies.length === 1) {
            this.ui.selectedEnemy = 0;
          }
          this.ui.footer.selectedTarget = this.ui.selectedEnemy;
          break;
        default:
          this.ui.selectedEnemy = null;
          this.ui.selectedPlayer = null;
          this.ui.footer.selectedTarget = 0;
      }
    },

    enterSyncState() {
      this.ui.state = UIState.SYNC;
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      const character = this.controlledCharacter;
      // this.ui.actingCharacter = character.id;
      this.ui.footer.display = true;
      this.ui.footer.observer = true;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      // this.ui.footer.skills = character.skills;
      this.ui.footer.itemName = "Syncing";
      this.ui.footer.itemDescription = "...";
    },

    enterAwaitPlayerState() {
      this.ui.state = UIState.AWAITING_PLAYER_ACTION;
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      const character = this.activeCharacter;
      this.ui.actingCharacter = character.id;
      this.ui.footer.display = this.playerId != null;
      this.ui.footer.observer = true;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      this.ui.footer.skills = [];
      this.ui.footer.itemName = character.name;
      this.ui.footer.itemDescription = `(${character.classData.name}) is thinking...`;
    },

    enterAnimationState() {
      this.ui.state = UIState.ANIMATION;
      this.ui.targetMode = null;
      this.ui.selectedEnemy = null;
      this.ui.selectedPlayer = null;
      const character = this.activeCharacter;
      this.ui.actingCharacter = character.id;
      this.ui.footer.display = this.playerId != null;
      this.ui.footer.observer = true;
      this.ui.footer.characterData = character;
      this.ui.footer.selectedSkill = null;
      this.ui.footer.selectedTarget = null;
      // this.ui.footer.skills = [];
      this.ui.footer.itemName = character.name;
      this.ui.footer.itemDescription = "'s turn.";
    }

    // refreshSlides() {
    //   const slidesContainer = document.getElementById("slides-container");
    //   const slide = document.querySelector(".slide");
    //   const slideWidth = slide.clientWidth;
    //   slidesContainer.scrollLeft = this.currentTurn * slideWidth;
    // }
  },

  mounted() {
    Rune.initClient({
      onChange: ({
        newGame,
        // oldGame,
        yourPlayerId,
        players,
        action,
        // event,
        // rollbacks,
      }): void => {
        // Update interface based on game state from logic.ts.
        // The `onChange` function must be synchronous.
        // It may trigger async functions if needed, but cannot `await` them.
        console.log("onChange()");
        if (action == null) {
          // Not a partial update. Might be a post-setup call, for example.
          // if (event != null) {
          //   if (event.event === "playerJoined" || event.event === "playerLeft") {}
          // }
          this.onSetupDone(newGame, yourPlayerId, players);
        } else {
          this.animateNewGameState(newGame, yourPlayerId);
        }
      },
    });
  }
}
</script>


<template>
  <p>Hello, world!</p>
  <HelloWorld msg="Vite + Vue" />
</template>


<style scoped>
</style>
