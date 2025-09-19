import * as THREE from "three";
import gsap from "gsap";

export class ClickHandler {
  constructor(camera, renderer, scene, camHandler, stageCube, backButtonStage, backButtonCard, playmusicButton) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = renderer.domElement;
    this.camHandler = camHandler;
    this.stageCube = stageCube;

    this.backButtonStage = backButtonStage;
    this.backButtonCard = backButtonCard;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.pillows = [];
    this.instruments = [];
    this.cards = new Map(); // Map instrument name (lowercase) => card mesh
    this.audio = new Map(); // Map instrument name => audio object

    this.disabledPillows = new Set();

    this.mode = "stage"; // Keeping mode but not blocking clicks based on it for now

    this.activeInstrument = null;
    this.activeCardMesh = null;

    this.canvas.addEventListener("pointerdown", (e) => this.onClick(e));

    // Back button aimed at stage
    this.backButtonStage.addEventListener("click", () => {
      if (this.mode === "instruments") {
        this.camHandler.returnToStage(this.stageCube);
        this.disabledPillows.clear();
        this.backButtonStage.style.display = "none";
        this.mode = "stage";
      } else if (this.mode === "card") {
        this.hideCard();
      }
    });

    // Back button aimed at cards
    this.backButtonCard.addEventListener("click", () => {
      if (this.mode === "card") {
        this.hideCard();
      }
    });
  }
     
    this.playmusicButton.addEventListener("click", () => {
      if (this.mode === "card") {
        
      }

  addPillow(pillow) {
    this.pillows.push(pillow);
  }

  addInstrument(instrument) {
    this.instruments.push(instrument);
  }

  addCard(instrumentName, cardMesh) {
    this.cards.set(instrumentName.toLowerCase(), cardMesh);
    cardMesh.visible = false; // hide initially
  }
  addAudio(cardname, audiofile) {
    this.audio.set(cardname.toLowerCase(), audiofile);
  }

  onClick(event) {
    // Pillow click logic as in your existing code unchanged:
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (!intersects.length) return;

    const hit = intersects[0].object;

    for (const pillow of this.pillows) {
      let parent = hit;
      while (parent) {
        if (parent === pillow) {
          if (!this.disabledPillows.has(pillow)) {
            this.disabledPillows.add(pillow);
            this.camHandler.focusOn(pillow, () => {
              this.backButtonStage.style.display = "block";
              this.mode = "instruments";
            });
          }
          return; // handled pillow click
        }
        parent = parent.parent;
      }
    }

    // Similar logic for instruments (cards):
    for (const instrument of this.instruments) {
      let parent = hit;
      while (parent) {
        if (parent === instrument) {
          const card = this.cards.get(instrument.userData.name.toLowerCase());
          if (card) {
            this.showCard(card);
          }
          return; // handled instrument click
        }
        parent = parent.parent;
      }
    }
  }

  showCard(card) {
    if (this.activeCardMesh) this.hideCard();

    // Position card 10 units in front of camera
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    const pos = this.camera.position.clone().add(camDir.multiplyScalar(4));
    card.position.copy(pos);
    card.lookAt(this.camera.position);
    card.scale.set(0.1, 0.1, 0.1);
    card.visible = true;

    gsap.to(card.scale, {
      x: 40, y: 40, z: 40,
      duration: 3,
      ease: "back.out(1.7)"
    });
    gsap.to(card.position, {
      y: card.position.y + 0.5,
      duration: 0.7,
      ease: "power2.out"
    });

    this.activeCardMesh = card;
    this.backButtonStage.style.display = "none";
    this.backButtonCard.style.display = "block";
    this.playmusicButton.style.display = "block";
    this.mode = "card";
  }

  hideCard() {
    if (!this.activeCardMesh) return;

    gsap.to(this.activeCardMesh.scale, {
      x: 0.1, y: 0.1, z: 0.1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        this.activeCardMesh.visible = false;
        this.activeCardMesh = null;
      }
    });

    this.backButtonCard.style.display = "none";
    this.backButtonStage.style.display = "block";
    this.mode = "instruments";
  }
}
// Note: The above code assumes that the card models are already added to the scene and mapped to their respective instruments using addCard method.