// // CameraHandler.js
// import * as THREE from "three";
// import gsap from "gsap";

// export class CameraHandler {
//   constructor(camera) {
//     this.camera = camera;
//     this.stagePosition = null;
//     this.lastPillow = null;
//   }

//   // === Intro pan (seats → stage) ===
//   introPan(startObj, endObj, duration = 3000, onComplete) {
//     const startPos = startObj.position.clone().add(new THREE.Vector3(0, 5, 15));
//     const endPos = endObj.position.clone().add(new THREE.Vector3(-20, 7.5, 0));

//     this.stagePosition = endPos.clone();
//     this.camera.position.copy(startPos);

//     gsap.to(this.camera.position, {
//       duration: duration / 1000,
//       x: endPos.x,
//       y: endPos.y,
//       z: endPos.z,
//       ease: "power2.inOut",
//       onUpdate: () => this.camera.lookAt(endObj.position),
//       onComplete
//     });
//   }

//   // === Focus on pillow (straight line, custom offset per pillow) ===
//   focusOn(target, onComplete) {
//     this.lastPillow = target;

//     const targetPos = new THREE.Vector3();
//     target.getWorldPosition(targetPos);

//     // Different offsets depending on pillow
//     let offset;
//     switch (target.name) {
//       case "pillowleft":
//         console.log("focusing on left pillow");
//         offset = new THREE.Vector3(0, 45, 60); // slightly angle
        
//         break;
//       case "pillowright":
//         offset = new THREE.Vector3(0, 45, -60); // opposite side
//         break;
//       case "pillow":
//       default:
//         offset = new THREE.Vector3(-40, 15, 2); // centered
//         break;
//     }

//     const endPos = targetPos.clone().add(offset);

//     this.focusTween = gsap.to(this.camera.position, {
//       duration: 2,
//       x: endPos.x,
//       y: endPos.y,
//       z: endPos.z,
//       ease: "none",
//       onUpdate: () => this.camera.lookAt(targetPos),
//       onComplete
//     });
//   }

//   // === Return to stage (straight line behind stage) ===
// returnToStage(stageCube, onComplete = () => {}) {
//   if (!this.focusTween || !this.lastPillow) return;

//   // Get world positions
//   const pillowPos = new THREE.Vector3();
//   this.lastPillow.getWorldPosition(pillowPos);

//   const stagePos = new THREE.Vector3();
//   stageCube.getWorldPosition(stagePos);

//   // Dummy object we tween between pillow → stage
//   const lookTarget = { x: pillowPos.x, y: pillowPos.y, z: pillowPos.z };

//   // Timeline so both run together
//   const tl = gsap.timeline({ onComplete });

//   // Step 1: reverse the existing camera path
//   tl.add(this.focusTween.reverse(), 0);

//   // Step 2: tween lookTarget from pillow → stage over same duration
//   tl.to(lookTarget, {
//     duration: this.focusTween.duration(),
//     x: stagePos.x,
//     y: stagePos.y,
//     z: stagePos.z,
//     ease: "none",
//     onUpdate: () => {
//       this.camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
//     }
//   }, 0); // start at same time
// }
// }/*
//     if (!this.stagePosition) {
//       console.warn("⚠️ Stage position not saved!");
//       return;
//     }

//     const stageTarget = new THREE.Vector3();
//     stageCube.getWorldPosition(stageTarget);

//     // Move camera behind stage position
//     const endPos = this.stagePosition.clone().add(new THREE.Vector3(-20, 0, 0));

//     gsap.to(this.camera.position, {
//       duration: 4,
//       x: endPos.x,
//       y: endPos.y,
//       z: endPos.z,
//       ease: "back.out",
//       onUpdate: () => this.camera.lookAt(target.name),
//       onComplete: () => {
//       // Once arrived, switch focus to stage
//       const stageTarget = new THREE.Vector3();
//       stageCube.getWorldPosition(stageTarget);

//       gsap.to({}, {
//         duration: 1.5,
//         onUpdate: () => this.camera.lookAt(stageTarget),
//         onComplete
//     });
//   }
// });*/

// CameraHandler.js
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

  // === Focus on pillow (cinematic offsets per pillow) ===
  focusOn(target, onComplete) {
    this.lastPillow = target;

    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);

    // Cinematic offsets for better framing
    let offset;
    switch (target.name) {
      case "pillowleft":
        offset = new THREE.Vector3(50, 25, 60); // left side, raised, angled inward
        break;
      case "pillowright":
        offset = new THREE.Vector3(50, 25, -60); // right side, raised, angled inward
        break;
      case "pillow":
      default:
        offset = new THREE.Vector3(-60, 30, 0); // center, slightly back and above
        break;
    }

    const endPos = targetPos.clone().add(offset);

    this.focusTween = gsap.to(this.camera.position, {
      duration: 2,
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      ease: "power2.inOut",
      onUpdate: () => this.camera.lookAt(targetPos),
      onComplete
    });
  }

  // === Return to stage (smooth back transition) ===
  returnToStage(stageCube, onComplete = () => {}) {
    if (!this.focusTween || !this.lastPillow) return;

    const pillowPos = new THREE.Vector3();
    this.lastPillow.getWorldPosition(pillowPos);

    const stagePos = new THREE.Vector3();
    stageCube.getWorldPosition(stagePos);

    const lookTarget = { x: pillowPos.x, y: pillowPos.y, z: pillowPos.z };

    const tl = gsap.timeline({ onComplete });

    // Step 1: reverse the camera move
    tl.add(this.focusTween.reverse(), 0);

    // Step 2: update lookAt target from pillow → stage
    tl.to(
      lookTarget,
      {
        duration: this.focusTween.duration(),
        x: stagePos.x,
        y: stagePos.y,
        z: stagePos.z,
        ease: "power2.inOut",
        onUpdate: () => {
          this.camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
        }
      },
      0
    );
  }
}
