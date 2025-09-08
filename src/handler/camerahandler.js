// CameraHandler.js
import * as THREE from "three";
import gsap from "gsap";

export class CameraHandler {
  constructor(camera) {
    this.camera = camera;
    this.stagePosition = null;
    this.lastPillow = null;
  }

  // === Intro pan (seats → stage) ===
  introPan(startObj, endObj, duration = 3000, onComplete) {
    const startPos = startObj.position.clone().add(new THREE.Vector3(0, 5, 15));
    const endPos = endObj.position.clone().add(new THREE.Vector3(-20, 7.5, 0));

    this.stagePosition = endPos.clone();
    this.camera.position.copy(startPos);

    gsap.to(this.camera.position, {
      duration: duration / 1000,
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      ease: "power2.inOut",
      onUpdate: () => this.camera.lookAt(endObj.position),
      onComplete
    });
  }

  // === Focus on pillow (straight line, custom offset per pillow) ===
  focusOn(target, onComplete = () => {}) {
    this.lastPillow = target;

    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);

    // Different offsets depending on pillow
    let offset;
    switch (target.name) {
      case "pillow_left":
        offset = new THREE.Vector3(-20, 15, 30); // slightly angled
        break;
      case "pillow_right":
        offset = new THREE.Vector3(-20, 15, -30); // opposite side
        break;
      case "pillow_center":
      default:
        offset = new THREE.Vector3(-40, 15, 2); // centered
        break;
    }

    const endPos = targetPos.clone().add(offset);

    gsap.to(this.camera.position, {
      duration: 2,
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      ease: "power2.inOut",
      onUpdate: () => this.camera.lookAt(targetPos),
      onComplete
    });
  }

  // === Return to stage (straight line behind stage) ===
  returnToStage(stageCube, onComplete = () => {}) {
    if (!this.stagePosition) {
      console.warn("⚠️ Stage position not saved!");
      return;
    }

    const stageTarget = new THREE.Vector3();
    stageCube.getWorldPosition(stageTarget);

    // Move camera behind stage position
    const endPos = this.stagePosition.clone().add(new THREE.Vector3(-20, 0, 0));

    gsap.to(this.camera.position, {
      duration: 2,
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      ease: "power2.inOut",
      onUpdate: () => this.camera.lookAt(stageTarget),
      onComplete
    });
  }
}
