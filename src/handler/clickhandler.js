import * as THREE from "three";

/**
 * Handles clicks:
 * - Pillow click → pans camera to pillow
 * - Stage click → returns camera to stage
 */
export class ClickHandler {
  constructor(camera, renderer, scene, camHandler, stageCube) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.camHandler = camHandler;
    this.stageCube = stageCube;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pillows = []; // store pillow objects

    // Bind click event
    this.renderer.domElement.addEventListener("click", (event) => this.onClick(event));
  }

  // Add a pillow to make it clickable
  addPillow(pillow) {
    this.pillows.push(pillow);
  }

  // Handle clicks
  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (!intersects.length) return;

    const hit = intersects[0].object;

    // Check if pillow clicked
    for (const pillow of this.pillows) {
      if (hit === pillow || pillow.children.includes(hit)) {
        this.camHandler.focusOn(pillow);
        return;
      }
    }

    // Check if stage clicked
    if (hit === this.stageCube || this.stageCube.children.includes(hit)) {
      this.camHandler.returnToStage(this.stageCube);
    }
  }
}
