export function showLoadingScreen() {
  const overlay = document.createElement("div");
  overlay.id = "loading-screen";
  overlay.innerHTML = `
    <div class="loader-container">
      <div class="loader-text">
        Loading assets... <span id="loading-percent">0%</span>
      </div>
      <div class="loader-bar">
        <div class="loader-progress"></div>
      </div>
      <div id="loading-tip" style="opacity:0;"></div>
    </div>
    <div class="curtain left-curtain"></div>
    <div class="curtain right-curtain"></div>
    <button id="start-btn">Start</button>
  `;
  document.body.appendChild(overlay);

  // ✅ Tips array
  const tips = [
    "💡 Tip: Mobile users, please rotate your phone to landscape 📱",
    "💡 Tip: The pillows can be clicked to zoom in 🛋️",
    "💡 Tip: After zooming to a pillow, click an instrument to learn more 🎶"
  ];

  const tipEl = document.getElementById("loading-tip");
  let currentTip = 0;

  function showTip(index) {
    tipEl.style.opacity = 0;
    setTimeout(() => {
      tipEl.textContent = tips[index];
      tipEl.style.opacity = 1;
    }, 300); // fade-out before showing next
  }

  // show first tip after 1s
  setTimeout(() => showTip(currentTip), 1000);

  // cycle tips every 5s
  setInterval(() => {
    currentTip = (currentTip + 1) % tips.length;
    showTip(currentTip);
  }, 5000);
}


  


export function updateLoadingProgress(percent) {
  const progress = document.querySelector(".loader-progress");
  const text = document.getElementById("loading-percent");
  if (progress) progress.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}%`;

  if (percent >= 100) {
    document.getElementById("loading-screen")?.classList.add("loaded");

    document.querySelectorAll(".curtain").forEach(c => {
      c.style.animation = "none";
    });

    const loader = document.querySelector(".loader-container");
    if (loader) loader.style.opacity = "0";

    const startBtn = document.getElementById("start-btn");
    if (startBtn) {
      setTimeout(() => startBtn.classList.add("show"), 500);
    }
  }
}

export function enableCurtains(onCurtainsOpen) {
  const startBtn = document.getElementById("start-btn");
  if (!startBtn) return;

  startBtn.onclick = () => {
    startBtn.classList.remove("show");
    startBtn.classList.add("fade-out");

    const overlay = document.getElementById("loading-screen");
    overlay?.classList.add("curtains-open"); // triggers curtain CSS animation

    if (onCurtainsOpen) onCurtainsOpen();

    // remove after animation
    setTimeout(() => {
      overlay?.remove();
    }, 3000);
  };
}
