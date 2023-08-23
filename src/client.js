// SPDX-License-Identifier: MIT
// Copyright © 2023 André "Oatspear" Santos

const { createApp } = Vue;



const app = createApp();

app.component("BattleSetup", BattleSetup);
app.component("BattleHeader", BattleHeader);
app.component("BattleHistoryEvent", BattleHistoryEvent);
app.component("BattleBoard", BattleBoard);
app.component("BattleScene", BattleScene);
app.component("BattleCharacter", BattleCharacter);
app.component("BattleFooter", BattleFooter);
app.component("BattlePlayerInfo", BattlePlayerInfo);
app.component("BattleActionBar", BattleActionBar);
app.component("BattleIconLabel", BattleIconLabel);

app.mount("#app");

/*******************************************************************************
  Rune Setup
*******************************************************************************/


