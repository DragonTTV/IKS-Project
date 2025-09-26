
import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { loadModels } from "./handler/modelHandler.js"; // ensure this path
import { enableCurtains, showLoadingScreen } from "./utils/loadingScreen.js";
import "../src/styles/loading.css";
import { CameraHandler } from "./handler/camerahandler.js";
import { ClickHandler } from "./handler/clickhandler.js";
// import TWEEN from "@tweenjs/tween.js";
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

showLoadingScreen && showLoadingScreen();

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
document.body.appendChild(renderer.domElement);

// === Back Buttons ===
const backButton = document.createElement("button");
backButton.innerText = "⟵ Back to Stage";
Object.assign(backButton.style, {
  position: "absolute",
  top: "20px",
  left: "20px",
  padding: "10px 15px",
  fontSize: "16px",
  background: "rgba(0,0,0,0.6)",
  color: "white",
  border: "1px solid white",
  borderRadius: "8px",
  cursor: "pointer",
  zIndex: "10",
  display: "none"
});
document.body.appendChild(backButton);

const backButtonCard = document.createElement("button");
backButtonCard.innerText = "⟵ Back to Instruments";
Object.assign(backButtonCard.style, {
  position: "absolute",
  top: "20px",
  left: "150px",
  padding: "10px 15px",
  fontSize: "16px",
  background: "rgba(0,0,0,0.6)",
  color: "white",
  border: "1px solid white",
  borderRadius: "8px",
  cursor: "pointer",
  zIndex: "10",
  display: "none"
});
document.body.appendChild(backButtonCard);

const playmusicButton = document.createElement("button");
playmusicButton.innerText = "▶";
Object.assign(playmusicButton.style, {
  position: "absolute",
  bottom: "100px",
  right: "300px",
  padding: "10px 15px",
  fontSize: "16px",
  background: "rgba(195, 136, 0, 1)",
  color: "black",
  border: "1px solid white",
  borderRadius: "8px",
  cursor: "pointer",
  zIndex: "10",
  display: "none"
});
document.body.appendChild(playmusicButton);

const stopmusicButton = document.createElement("button");
stopmusicButton.innerText = "||";
Object.assign(stopmusicButton.style, {
  position: "absolute",
  bottom: "100px",
  right: "300px",
  padding: "10px 15px",
  fontSize: "16px",
  background: "rgba(195, 136, 0, 1)",
  color: "black",
  border: "1px solid white",
  borderRadius: "8px",
  cursor: "pointer",
  zIndex: "10",
  display: "none"
});
document.body.appendChild(stopmusicButton);

// === Camera & Scene ===
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.rotation.y = -Math.PI / 2;
camera.position.set(0, 5, 0);

const scene = new THREE.Scene();

// === Dummy targets ===
const stagecube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
stagecube.position.set(350.8986681999935, 44.18452249208729, 8.335760422847635);
stagecube.name = "stageCube";
scene.add(stagecube);
stagecube.scale.set(0.01,0.01,0.01);
stagecube.visible = false;

const seatscube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
seatscube.name = "seatsCube";
scene.add(seatscube);
seatscube.visible = false;

// === Camera handler ===
const camHandler = new CameraHandler(camera);

(async () => {
  try {
    const models = await loadModels(scene, renderer);

    // Hide all card models initially
    Object.values(models).forEach(m => {
      if (m.userData?.type === "card") {
        m.visible = false;
      }
    });

    // === Click handler ===
    const clickHandler = new ClickHandler(
      camera, renderer, scene, camHandler, stagecube,
      backButton, backButtonCard, playmusicButton,stopmusicButton
    );

    clickHandler.addPillow(models.pillow);
    clickHandler.addPillow(models.pillowleft);
    clickHandler.addPillow(models.pillowright);

    clickHandler.addInstrument(models.bhangkora);
    clickHandler.addInstrument(models.gogona);
    clickHandler.addInstrument(models.ektara);
    clickHandler.addInstrument(models.esraj);
    clickHandler.addInstrument(models.hudukka);
    clickHandler.addInstrument(models.khuang);
    clickHandler.addInstrument(models.mayurveena);
    clickHandler.addInstrument(models.ottu);
    clickHandler.addInstrument(models.morsing);
    clickHandler.addInstrument(models.khamak);

    clickHandler.addCard("bhangkora", models.bhangkoraCard);
    clickHandler.addCard("gogona", models.gogonaCard);
    clickHandler.addCard("ektara", models.ektaraCard);
    clickHandler.addCard("esraj", models.esrajCard);
    clickHandler.addCard("hudukka", models.hudukkaCard);
    clickHandler.addCard("khuang", models.khuangCard);
    clickHandler.addCard("mayurveena", models.mayurveenaCard);
    clickHandler.addCard("ottu", models.ottuCard);
    clickHandler.addCard("morsing", models.morsingCard);
    clickHandler.addCard("khamak", models.khamakCard);

    clickHandler.addAudio("bhangkora", "/assets/audio/bhangkora.mp3");
    clickHandler.addAudio("gogona", "/assets/audio/gogona.mp3");  
    clickHandler.addAudio("ektara", "/assets/audio/ektara.mp3"); 
    clickHandler.addAudio("esraj", "/assets/audio/esraj.mp3");   
    clickHandler.addAudio("hudukka", "/assets/audio/hudukka.mp3");
    clickHandler.addAudio("khuang", "/assets/audio/khuang1.mp3");
    clickHandler.addAudio("mayurveena", "/assets/audio/mayurveena.mp3");
    clickHandler.addAudio("ottu", "/assets/audio/ottu.mp3");
    clickHandler.addAudio("morsing", "/assets/audio/morsing.mp3"); 
    clickHandler.addAudio("khamak", "/assets/audio/khamak.mp3");
    


    console.log("✅ All models loaded:", models);
  } catch (err) {
    console.error("❌ Error while loading models:", err);
  } finally {
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "none";
  }
})();

// === Curtains intro ===
enableCurtains && enableCurtains(() => {
  camHandler.introPan(seatscube, stagecube);
});

// === Lights ===
scene.add(new THREE.AmbientLight(0xffffff, 1));

const stageLight = new THREE.RectAreaLight(0xFFFFC5, 60, 80, 120);
stageLight.rotation.x = THREE.MathUtils.degToRad(-90);
stageLight.position.set(508, 290, 0);
scene.add(stageLight);
// scene.add(new RectAreaLightHelper(stageLight, 0xffffff));

// === Resize handling ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animate ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
