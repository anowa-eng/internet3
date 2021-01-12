const internet3 = {};
internet3.__create = function (objectName) {
  internet3[objectName] = {};
};
internet3.sounds = {
  invalid: new Audio("src/assets/sounds/invalid.wav")
};
internet3.pause = (audio) => internet3.sounds[audio].pause();
internet3.time = function (audio, time) {
  internet3.sounds[audio].currentTime = time;
};
internet3.play = function (audio, duration = null) {
  internet3.time(audio, 0);
  internet3.sounds[audio].play();
  setTimeout(
    function () {
      internet3.sounds[audio].pause();
    },
    !duration ? internet3.sounds[audio].duration * 1000 : duration
  );
};
internet3.__create("insertLoadingScreen");
internet3.__create("removeLoadingScreen");
internet3.insertLoadingScreen.into = function (element, background = "#333") {
  let target;
  target = document.querySelector(element);
  if (typeof element === "string") {
    let html = document.createElement("html");
    html.innerHTML =
      '<head><style>@keyframes wave-y{0%{transform:translateY(10px)}50%{transform:translateY(-10px)}100%{transform:translateY(10px)}}.loading{width:100vw;height:100vh;background:#333;color:#d3d3d3;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-family:NexaRegular,Inter}.loading .rectangles{display:flex;flex-direction:row}.loading .rectangles .rectangle{width:15px;height:15px;border-radius:25%;background:#ddd;animation:wave-y ease-in-out 2s infinite}.loading .rectangles .rectangle-1{animation-delay:-1.5s}.loading .rectangles .rectangle-2{margin:0 20px;animation-delay:-1s}.loading .rectangles .rectangle-3{animation-delay:-.5s}.loading .text{position:relative;top:30px;text-transform:uppercase;letter-spacing:.15em}*{margin:0}</style></head><body><div class="loading"><div class="rectangles"> <div class="rectangle rectangle-1"></div><div class="rectangle rectangle-2"></div><div class="rectangle rectangle-3"></div></div><div class="text">Loading...</div></div></body>';
    target.appendChild(html);
    return {
      screen: target.querySelector(".loading"),
      target: target
    };
  } else
    throw new TypeError(`${element.toString()} is not an element or string.`);
};
internet3.removeLoadingScreen.from = function (
  $ = null,
  element,
  statement = function () {}
) {
  let target = document.querySelector(element);

  if (!$)
    new Promise(() => {
      target
        .querySelector(".loading")
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });
    })
      .then(() => target.querySelector(".loading"))
      .then(() => statement);
  else {
    $(target)
      .find(".loading")
      .fadeOut(1000, () => {
        $(target).find(".loading").empty();
        statement();
      });
  }
};
internet3.color = function (image) {
  let canvasElement = document.createElement("canvas");
  canvasElement.width = 100;
  canvasElement.height = 100;
  canvasElement.crossOrigin = "Anonymous";
  let context = canvasElement.getContext("2d");
  context.drawImage(image, 0, 0, 100, 100);
  let pixelColors = [],
    sortingObject = {};
  for (let row = 0; row < 100; row++) {
    for (let column = 0; column < 100; column++) {
      pixelColors.push(
        `rgba(${[...context.getImageData(row, column, 1, 1).data].join(", ")})`
      );
    }
  }
  pixelColors.forEach(function (color) {
    if (sortingObject[color]) ++sortingObject[color];
    else sortingObject[color] = 1;
  });
  return {
    palette: () => sortingObject.keys(),
    common: () =>
      Object.entries(sortingObject).filter(
        (arr) =>
          arr[1] ===
          Math.max(...Object.entries(sortingObject).map((arr) => arr[1]))
      )[0][0]
  };
};
