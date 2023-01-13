const { createApp } = Vue

const app = createApp({
  data() {
    return {
      message: "Hello Vue!"
    };
  }
});

app.component("BattleHeader", BattleHeader);
app.component("BattleRegion", BattleRegion);
app.component("BattleTile", BattleTile);
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
