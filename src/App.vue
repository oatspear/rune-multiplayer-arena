<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue"

Rune.initClient({
  onChange: ({ newGame, oldGame, yourPlayerId, players }) => {
    // unused param: action
    // unused param: event
    // unused param: 
    // setMyPlayerId(yourPlayerId);
    // setGame(newGame);
    // update players
    // setPlayerList(Object.keys(players).sort().map(k => players[k]));
    // check for score
    // if (newGame.score > oldGame.score) {
    //   playSound("score");
    // } else {
    //   if (newGame.tasks.length < oldGame.tasks.length) {
    //     playSound("fail");
    //   } else {
    //     if (newGame.tasks.length > 0 && oldGame.tasks.length > 0) {
    //       if (newGame.tasks[0].id != oldGame.tasks[0].id) {
    //         playSound("fail");
    //       }
    //     }
    //   }
    // }
  },
});
</script>


<template>
  <p>Hello, world!</p>
  <HelloWorld msg="Vite + Vue" />
</template>


<style scoped>
</style>
