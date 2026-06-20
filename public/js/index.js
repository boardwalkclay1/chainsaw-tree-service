import hero from "./modules/hero.js";
import difference from "./modules/difference.js";
import estimate from "./modules/estimate.js";
import selfCheck from "./modules/selfCheck.js";
import services from "./modules/services.js";
import gardening from "./modules/gardening.js";
import about from "./modules/about.js";
import footer from "./modules/footer.js";
import yardDesigner from "./tools/yardDesigner.js";
import initScroll from "./logic/scroll.js";
import initSeasonal from "./logic/seasonal.js";

const app = document.getElementById("app");

app.innerHTML =
  hero() +
  difference() +
  estimate() +
  selfCheck() +
  services() +
  gardening() +
  about() +
  yardDesigner() +
  footer();

initScroll();
initSeasonal();
