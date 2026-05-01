export default function initSeasonal() {
  const month = new Date().getMonth(); // 0-11
  let cls = "";

  if (month === 11 || month === 0) cls = "season-winter";
  else if (month >= 2 && month <= 4) cls = "season-spring";
  else if (month >= 5 && month <= 8) cls = "season-summer";
  else cls = "season-fall";

  document.body.classList.add(cls);
}
