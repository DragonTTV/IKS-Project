import * as THREE from "three";
import gsap from "gsap";

export class CameraHandler {
  constructor(camera, controls = null) {
    this.camera = camera;
    this.controls = controls; // optional if you later want OrbitControls
  }

  // Intro pan: move camera from "seat cube" → "stage cube"
  introPan(startTarget, endTarget) {
    this.camera.position.copy(startTarget.position);
    this.camera.lookAt(endTarget.position);

    gsap.to(this.camera.position, {
      duration: 2,
      x: endTarget.position.x - 20,
      y: endTarget.position.y + 7.5,
      z: endTarget.position.z,
      ease: "none",
      onUpdate: () => {
        this.camera.lookAt(endTarget.position);
      }
    });
  }

  // -----------------------
  // PAN TO A PILLOW
  // -----------------------
  focusOn(target) {
    const targetPos = target.position.clone();
    const offset = new THREE.Vector3(15, 10, 15); // camera offset

    gsap.to(this.camera.position, {
      duration: 2,
      x: targetPos.x + offset.x,
      y: targetPos.y + offset.y,
      z: targetPos.z + offset.z,
      ease: "power2.inOut",
      onUpdate: () => {
        this.camera.lookAt(targetPos);
      }
    });
  }

  // -----------------------
  // RETURN TO STAGE
  // -----------------------
  returnToStage(stageTarget) {
    const stagePos = stageTarget.position.clone();

    gsap.to(this.camera.position, {
      duration: 2,
      x: stagePos.x - 20,
      y: stagePos.y + 7.5,
      z: stagePos.z,
      ease: "power2.inOut",
      onUpdate: () => {
        this.camera.lookAt(stagePos);
      }
    });
  }
}

// Initialization helper
export const cameraHandler1 = {
  init(camera, controls) {
    return new CameraHandler(camera, controls);
  }
};
