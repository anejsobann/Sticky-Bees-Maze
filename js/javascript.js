let labirint;
let canvas;
let canvasOverlay;
let ctx;
let currentPixel;
let speed;
let stopped;
let pixels = [];
let img;
let imgBee;
let positions;

const solution = [
  [247, 2],
  [247, 15],
  [226, 27],
  [226, 99],
  [247, 112],
  [247, 136],
  [268, 148],
  [268, 172],
  [226, 196],
  [247, 208],
  [247, 233],
  [268, 245],
  [310, 220],
  [352, 245],
  [352, 318],
  [331, 330],
  [310, 318],
  [310, 366],
  [331, 378],
  [331, 354],
  [352, 342],
  [352, 366],
  [373, 354],
  [373, 330],
  [394, 318],
  [394, 293],
  [373, 305],
  [373, 257],
  [394, 269],
  [415, 257],
  [415, 233],
  [436, 220],
  [436, 269],
  [478, 293],
  [478, 318],
  [436, 293],
  [436, 318],
  [415, 305],
  [415, 330],
  [394, 342],
  [394, 366],
  [415, 378],
  [415, 402],
  [436, 390],
  [436, 414],
  [415, 426],
  [394, 414],
  [352, 439],
  [331, 426],
  [331, 451],
  [352, 463],
  [331, 475],
  [310, 463],
  [310, 390],
  [289, 378],
  [289, 354],
  [268, 366],
  [247, 354],
  [247, 402],
  [205, 378],
  [205, 402],
  [226, 414],
  [205, 426],
  [184, 414],
  [184, 390],
  [163, 378],
  [163, 354],
  [184, 342],
  [226, 366],
  [226, 342],
  [247, 330],
  [247, 318],
];

function reset() {
  stopped = true;
  currentPixel = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// SOLUTION - DRAW
function solve() {
  if (stopped) {
    currentPixel = 0;
    stopped = false;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas first
  ctx.lineWidth = 3;
  ctx.lineCap = "round"; // Rounded ends of lines
  ctx.lineJoin = "round"; // Rounded joins between lines
  ctx.setLineDash([]); // No dashed lines, solid line only

  pixels.length = 0;
  for (let i = 1; i < solution.length; i++) {
    const x1 = solution[i - 1][0];
    const y1 = solution[i - 1][1];
    const x2 = solution[i][0];
    const y2 = solution[i][1];

    pixels.push(...getLinePixels(x1, y1, x2, y2));
  }

  function animate() {
    if (currentPixel < pixels.length && !stopped) {
      const [x, y] = pixels[currentPixel];
      positions.forEach((pos) => {
        if (pos[0] == x && pos[1] == y) {
          console.log("JACKPOOTTTJJJJJ");
          ctxOverlay.clearRect(pos[0] - 7.5, pos[1] - 7.5, 15, 15);
        }
      });
      // Clear previous position of the bee and redraw it at the new position
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for smooth movement
      // Scale factor (10% of original size)
      const scaleFactor = 0.12; //bee size
      const beeWidth = imgBee.width * scaleFactor;
      const beeHeight = imgBee.height * scaleFactor;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Redraw the background

      // Draw the bee image at the current position with scaling
      ctx.drawImage(
        imgBee,
        x - beeWidth / 2,
        y - beeHeight / 2,
        beeWidth,
        beeHeight
      );

      currentPixel++;

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, speed);
    } else {
      ctx.closePath();
    }
  }

  animate();
}

// METHOD - returna dolzine posamezne crte v pixlah, potem pa rise pixel po pixli
function getLinePixels(x1, y1, x2, y2) {
  const pixels = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    pixels.push([x1, y1]);

    if (x1 === x2 && y1 === y2) break;

    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  return pixels;
}

document.addEventListener("DOMContentLoaded", function () {
  canvas = document.querySelector("#kanvas");
  canvasOverlay = document.querySelector("#kanvasOverlay");
  ctx = canvas.getContext("2d");
  ctxOverlay = canvasOverlay.getContext("2d");

  currentPixel = 0;
  speed = 5;
  stopped = false;

  // Initialize bee image
  imgBee = new Image();
  imgBee.src = "./assets/cebela.png"; // Replace with your actual bee image path

  // Ensure the bee image is loaded before starting the animation
  function genPositions(num, solution) {
    let rand = [];
    for (let i = 0; i < num; i++) {
      rand.push(solution[Math.floor(Math.random() * solution.length - 1) + 1]);
    }
    return rand;
  }
  positions = genPositions(15, solution);

  function drawRect(x, y) {
    let pot = new Image();
    pot.src = "./assets/collectjar1.png";
    pot.onload = () => {
      ctxOverlay.drawImage(pot, x - 7.5, y - 7.5, 15, 15);
    };
  }

  function drawPots(solution) {
    for (let i = 0; i < solution.length; i++) {
      drawRect(solution[i][0], solution[i][1]);
    }
  }

  canvasOverlay.onload = drawPots(positions);

  imgBee.onload = () => {
    img = new Image(); // You should define and load the background image if needed

    img.onload = () => {
      solve(); // Start the animation after both images are loaded
    };
  };
});
