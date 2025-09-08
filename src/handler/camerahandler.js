import * as THREE from "three";
import gsap from "gsap";

export class CameraHandler {
  constructor(camera, controls = null) {
    this.camera = camera;
    this.controls = controls; // optional if you later want OrbitControls
  }

  // Intro pan: move camera from "seat cube" → "stage cube"
  introPan(startTarget, endTarget) {
    // Start at seat position
    console.log("hello")
    this.camera.position.copy(startTarget.position);
    this.camera.lookAt(endTarget.position);

    // Animate to stage position
    gsap.to(this.camera.position, {
      duration: 1.5,
      x: endTarget.position.x -20 , 
      y: endTarget.position.y + 7.5  ,
      z: endTarget.position.z  ,
      ease: "none",
      onUpdate: () => {
        this.camera.lookAt(endTarget.position);
      }
    });
  }
}

export const cameraHandler1 = {
  init(camera, controls) {
    return new CameraHandler(camera, controls);
  }
};
