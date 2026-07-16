// ACCESS CHECK
if (typeof userHasAccess !== "undefined" && userHasAccess === true) {
  document.getElementById("lessonGrid").style.display = "grid";
} else {
  document.getElementById("lockedMessage").style.display = "block";
}

// AUTO-PLAY SEQUENCE
const vids = [
  document.getElementById("lifelineVideo1"),
  document.getElementById("lifelineVideo2")
];

vids[0].addEventListener("ended", () => {
  vids[1].scrollIntoView({ behavior: "smooth" });
  vids[1].play();
});
