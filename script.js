const svg = document.getElementById("overlay");
const gridGroup = document.getElementById("grid");
const marker = document.getElementById("marker");
const buttons = document.querySelectorAll("#controls button");

// сдвинутый центр и расширенный круг
const CENTER = { x: 500, y: 425 };
const INNER_RADIUS = 370;
const STEP = 15;

let gridPoints = [];

// генерация сетки
for (let x = CENTER.x - INNER_RADIUS; x <= CENTER.x + INNER_RADIUS; x += STEP) {
  for (let y = CENTER.y - INNER_RADIUS; y <= CENTER.y + INNER_RADIUS; y += STEP) {
    const dx = x - CENTER.x;
    const dy = y - CENTER.y;

    if (Math.sqrt(dx * dx + dy * dy) <= INNER_RADIUS) {
      gridPoints.push({ x, y });

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 2.5);
      dot.classList.add("grid-point");
      gridGroup.appendChild(dot);
    }
  }
}

// текущее положение
let current = JSON.parse(localStorage.getItem("alignment")) || CENTER;
updateMarker(false);

// поиск ближайшей точки
function findNearest(x, y) {
  let best = gridPoints[0];
  let bestDist = Infinity;

  for (const p of gridPoints) {
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

// кнопки
buttons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // на всякий случай

    let dx = 0, dy = 0;

    switch (btn.dataset.dir) {
      case "up": dy = -STEP; break;    // к добру
      case "down": dy = STEP; break;   // к злу
      case "left": dx = -STEP; break;  // к закону
      case "right": dx = STEP; break;  // к хаосу
    }

    const target = findNearest(current.x + dx, current.y + dy);
    current = target;

    animateMarker(dx, dy);
    updateMarker();
  });
});

function updateMarker(save = true) {
  marker.setAttribute("cx", current.x);
  marker.setAttribute("cy", current.y);

  if (save) {
    localStorage.setItem("alignment", JSON.stringify(current));
  }
}

// визуальный «толчок»
function animateMarker(dx, dy) {
  marker.style.setProperty("--dx", `${dx * 0.3}px`);
  marker.style.setProperty("--dy", `${dy * 0.3}px`);

  marker.classList.remove("animate");
  void marker.offsetWidth; // перезапуск анимации
  marker.classList.add("animate");
}
