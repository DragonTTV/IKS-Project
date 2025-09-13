import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { loadModels } from "./handler/modelHandler.js"; // ensure this path
import { enableCurtains, showLoadingScreen } from "./utils/loadingScreen.js";
import "../src/styles/loading.css";

import { CameraHandler } from "./handler/camerahandler.js";
import { ClickHandler } from "./handler/clickhandler.js";

showLoadingScreen && showLoadingScreen();

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
document.body.appendChild(renderer.domElement);

// === Back Button ===
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

// === Camera & Scene ===
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.rotation.y = -Math.PI/2;
camera.position.set(0,5,0);
const scene = new THREE.Scene();

// === Dummy targets ===
const stagecube = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
stagecube.position.set(350.8986681999935, 44.18452249208729, 8.335760422847635);
stagecube.name = "stageCube";
scene.add(stagecube);

const seatscube = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
seatscube.name = "seatsCube";
scene.add(seatscube);
stagecube.visible = false;
seatscube.visible = false;
// === Camera handler ===
const camHandler = new CameraHandler(camera);

(async () => {
  try {
    const models = await loadModels(scene, renderer);

    // ensure models exist
    //models.pillow.name = "pillow_center";
    //models.pillowleft.name = "pillow_left";
    //models.pillowright.name = "pillow_right";

    // Scale & place models
    // models.theater1.scale.set(30, 30, 30);
    // models.carpet.scale.set(40,50,50);
    // models.carpet.position.set(478,-19.5,0);

    // models.pillow.scale.set(1, 0.632, 0.56);
    // models.pillow.position.set(508,-15.7,3);
    // models.pillow.rotation.y = Math.PI/2;

    // models.pillowleft.scale.set(0.6, 0.632, 0.56);
    // models.pillowleft.position.set(454,-15.7,-94);
    // models.pillowleft.rotation.y = -Math.PI/6;

    // models.pillowright.scale.set(0.6, 0.632, 0.56);
    // models.pillowright.position.set(454,-15.7,100);
    // models.pillowright.rotation.y = Math.PI/6;

    // // mics ...
    // models.mic.position.set(458,-15.7,3);
    // models.mic.scale.set(20,10,20);
    // models.mic.rotation.y = Math.PI/2;

    // models.micleft.position.set(440,-15.7,43);
    // models.micleft.scale.set(20,10,20);
    // models.micleft.rotation.y = Math.PI/4;

    // models.micright.position.set(440,-15.7,-40);
    // models.micright.scale.set(20,10,20);
    // models.micright.rotation.y = 3*Math.PI/4;

    //instruments

    // models.mayurveena1.position.set(500,-5.7,3)
    // models.mayurveena1.scale.set(5,5,5)
    // models.mayurveena1.rotation.set(95,-90,0)

    
    // === Click handler ===
    const clickHandler = new ClickHandler(camera, renderer, scene, camHandler, stagecube, backButton);
    clickHandler.addPillow(models.pillow);
    clickHandler.addPillow(models.pillowleft);
    clickHandler.addPillow(models.pillowright);

    console.log("✅ All models loaded:", models);
  } catch (err) {
    console.error("❌ Error while loading models:", err);
  } finally {
    // hide loading overlay if present
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
scene.add(new RectAreaLightHelper(stageLight, 0xffffff));

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
//LETS GOOOOO