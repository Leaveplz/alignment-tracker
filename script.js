const svg = document.getElementById("overlay");
const gridGroup = document.getElementById("grid");
const marker = document.getElementById("marker");

const CENTER = { x: 500, y: 500 };
const INNER_RADIUS = 320; // радиус внутреннего круга
const STEP = 30; // расстояние между допустимыми точками

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
      dot.setAttribute("r", 3);
      dot.classList.add("grid-point");
      gridGroup.appendChild(dot);
    }
  }
}

// загрузка сохранённого положения
const saved = JSON.parse(localStorage.getItem("alignment"));
if (saved) {
  marker.setAttribute("cx", saved.x);
  marker.setAttribute("cy", saved.y);
} else {
  marker.setAttribute("cx", CENTER.x);
  marker.setAttribute("cy", CENTER.y);
}

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

svg.addEventListener("click", (e) => {
  const rect = svg.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 1000;
  const y = ((e.clientY - rect.top) / rect.height) * 1000;

  const nearest = findNearest(x, y);

  marker.setAttribute("cx", nearest.x);
  marker.setAttribute("cy", nearest.y);

  localStorage.setItem("alignment", JSON.stringify(nearest));
});
