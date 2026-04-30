import hero from "./modules/hero/hero.js";
import difference from "./modules/difference/difference.js";
import estimate from "./modules/estimate/estimate.js";
import selfCheck from "./modules/selfCheck/selfCheck.js";
import services from "./modules/services/services.js";
import gardening from "./modules/gardening/gardening.js";
import about from "./modules/about/about.js";
import footer from "./modules/footer/footer.js";

const app = document.getElementById("app");

app.innerHTML =
  hero() +
  difference() +
  estimate() +
  selfCheck() +
  services() +
  gardening() +
  about() +
  footer();
