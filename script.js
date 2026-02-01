const svg = document.getElementById("overlay");
const gridGroup = document.getElementById("grid");
const marker = document.getElementById("marker");
const buttons = document.querySelectorAll("#controls button");

const CENTER = { x: 500, y: 500 };
const INNER_RADIUS = 320;
const STEP = 15; // в 2 раза плотнее

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
marker.setAttribute("cx", current.x);
marker.setAttribute("cy", current.y);

// найти ближайшую разрешённую точку
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

// клик по кругу
svg.addEventListener("click", (e) => {
  const rect = svg.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 1000;
  const y = ((e.clientY - rect.top) / rect.height) * 1000;

  current = findNearest(x, y);
  updateMarker();
});

// кнопки направления
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    let dx = 0, dy = 0;

    switch (btn.dataset.dir) {
      case "up": dy = -STEP; break;    // добро
      case "down": dy = STEP; break;   // зло
      case "left": dx = -STEP; break;  // закон
      case "right": dx = STEP; break;  // хаос
    }

    const target = findNearest(current.x + dx, current.y + dy);
    current = target;
    updateMarker();
  });
});

function updateMarker() {
  marker.setAttribute("cx", current.x);
  marker.setAttribute("cy", current.y);
  localStorage.setItem("alignment", JSON.stringify(current));
}
