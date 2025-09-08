export function showLoadingScreen() {
  const overlay = document.createElement("div");
  overlay.id = "loading-screen";
  overlay.innerHTML = `
    <div class="loader-container">
      <div class="loader-text">Loading assets... <span id="loading-percent">0%</span></div>
      <div class="loader-bar">
        <div class="loader-progress"></div>
      </div>
    </div>
    <div class="curtain left-curtain"></div>
    <div class="curtain right-curtain"></div>
    <button id="start-btn">Start</button>
  `;
  document.body.appendChild(overlay);
}

export function updateLoadingProgress(percent) {
  const progress = document.querySelector(".loader-progress");
  const text = document.getElementById("loading-percent");
  if (progress) progress.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}%`;

  if (percent >= 100) {
    // ✅ Curtains stop swaying & slightly pull back
    document.getElementById("loading-screen").classList.add("loaded");

    document.querySelectorAll(".curtain").forEach(c => {
      c.style.animation = "none";
    });

    // Hide loader text
    const loader = document.querySelector(".loader-container");
    if (loader) loader.style.opacity = "0";

    // Show Start button
    const startBtn = document.getElementById("start-btn");
    if (startBtn) {
      setTimeout(() => startBtn.classList.add("show"), 500);
    }
  }
}

export function enableCurtains() {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.onclick = () => {
      startBtn.classList.remove("show");
      startBtn.classList.add("fade-out");

      const overlay = document.getElementById("loading-screen");
      overlay.classList.add("curtains-open"); // ✅ triggers curtain slide + background fade

      // remove only after curtains are fully open
      setTimeout(() => overlay.remove(), 2000);
    };
  }
}
