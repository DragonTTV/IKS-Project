import * as THREE from "three";

export class ClickHandler {
  constructor(camera, renderer, scene, camHandler, stageCube, backButton) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = renderer.domElement;
    this.camHandler = camHandler;
    this.stageCube = stageCube;
    this.backButton = backButton;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pillows = [];
    this.disabledPillows = new Set();

    // Use pointerdown to better support touch and mouse
    this.canvas.addEventListener("pointerdown", (e) => this.onClick(e));

    // back button click
    this.backButton.addEventListener("click", () => {
      this.camHandler.returnToStage(this.stageCube);
      this.disabledPillows.clear();
      this.backButton.style.display = "none";
    });
  }

  addPillow(pillow) {
    this.pillows.push(pillow);
  }

  onClick(event) {
    // support touch & mouse coordinates relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    // test all scene children (true = recursive)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (!intersects.length) return;

    const hit = intersects[0].object;

    // check pillows (walk up parent chain)
    for (const pillow of this.pillows) {
      let parent = hit;
      while (parent) {
        if (parent === pillow) {
          if (!this.disabledPillows.has(pillow)) {
            this.disabledPillows.add(pillow);
            this.camHandler.focusOn(pillow, () => {
              this.backButton.style.display = "block";
            });
          }
          return; // handled
        }
        parent = parent.parent;
      }
    }

    // stage clicked? check equality or children
   /* if (hit === this.stageCube || this.stageCube.children.includes(hit)) {
      this.camHandler.returnToStage(this.stageCube);
      this.disabledPillows.clear();
      this.backButton.style.display = "none";
    }*/
  }
}
