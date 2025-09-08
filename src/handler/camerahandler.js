import * as THREE from "three";
import gsap from "gsap";

export class CameraHandler {
  constructor(camera, controls, scene, renderer) {
    this.camera = camera;
    this.controls = controls;
    this.scene = scene;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // clickable objects
    this.targets = {};

    // click event
    this.renderer.domElement.addEventListener("click", this.onClick.bind(this));
  }

  addTarget(name, object3D) {
    this.targets[name] = object3D;
  }

  // 🎥 Animate camera to a position + lookAt target
  moveTo(targetPos, lookAtObj, duration = 2) {
    this.controls.enabled = false; // disable orbit until finished

    gsap.to(this.camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration,
      onUpdate: () => {
        this.camera.lookAt(lookAtObj.position);
      },
      onComplete: () => {
        // lock on target
        this.controls.target.copy(lookAtObj.position);
        this.controls.update();
        this.controls.enabled = true; // allow rotation again
      }
    });
  }

  // 🎬 Pan across seats then lock on stage
  introPan(seatsPos, stagePos, stageObj) {
    this.moveTo(seatsPos, stageObj, 3);
    gsap.delayedCall(3, () => {
      this.moveTo(stagePos, stageObj, 2);
    });
  }

  // 🖱️ Handle clicks (raycasting)
  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      Object.values(this.targets), true
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const targetEntry = Object.entries(this.targets).find(([name, obj]) =>
        obj === object || obj === object.parent
      );

      if (targetEntry) {
        const [name, targetObj] = targetEntry;
        console.log(`🛋️ Clicked: ${name}`);

        // move camera closer to target
        const pos = new THREE.Vector3(
          targetObj.position.x + 3,
          targetObj.position.y + 2,
          targetObj.position.z + 5
        );
        this.moveTo(pos, targetObj, 2);
      }
    }
  }
}
