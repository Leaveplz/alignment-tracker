const svg = document.getElementById("overlay");
const marker = document.getElementById("marker");

// загрузка сохранённого положения
const saved = JSON.parse(localStorage.getItem("alignment"));
if (saved) {
  marker.setAttribute("cx", saved.x);
  marker.setAttribute("cy", saved.y);
}

// клик по кругу
svg.addEventListener("click", (e) => {
  const rect = svg.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 1000;
  const y = ((e.clientY - rect.top) / rect.height) * 1000;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);

  localStorage.setItem("alignment", JSON.stringify({ x, y }));
});
