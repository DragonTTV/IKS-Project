import * as THREE from "three";
import gsap from "gsap";

export class ClickHandler {
  constructor(camera, renderer, scene, camHandler, stageCube, backButton, backButtonCard, playmusicButton,stopmusicButton) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = renderer.domElement;
    this.camHandler = camHandler;
    this.stageCube = stageCube;

    this.backButton = backButton;
    this.backButtonCard = backButtonCard;
    this.playmusicButton = playmusicButton;
    this.stopmusicButton = stopmusicButton;

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
    this.backButton.addEventListener("click", () => {
      if (this.mode === "instruments") {
        this.camHandler.returnToStage(this.stageCube);
        this.disabledPillows.clear();
        this.backButton.style.display = "none";
        this.mode = "stage";
        console.log(this.mode);
      } 
    });

    // Back button aimed at cards
    this.backButtonCard.addEventListener("click", () => {
      if (this.mode === "card") {
        this.hideCard();
      }
    });
  
     
    this.playmusicButton.addEventListener("click", () => {
      if(this.mode==="card"){
        const cardName = this.activeCardMesh.userData.name.replace("Card", "");
        const audioPath = this.audio.get(cardName);
        this.handleAudio(audioPath);
        console.log(`Played audio for ${cardName} from ${audioPath}`);
        

      }
    });
    this.stopmusicButton.addEventListener("click", () => {
      if(this.mode==="audio"){
        this.stopmusic();
        

      }
    });
    
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
    console.log(`Adding audio: ${cardname} -> ${audiofile}`);
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
              this.backButton.style.display = "block";
              this.backButtonCard.style.display = "none";
              this.playmusicButton.style.display = "none";
              this.stopmusicButton.style.display = "none";
              this.mode = "instruments";
              console.log(this.mode);
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
      if(this.mode==="stage")return;
      else {while (parent) {
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
  
  handleAudio(audioPath)
    {
    this.playmusicButton.style.display = "none";
    this.mode="audio";
    console.log(this.mode);
    this.stopmusicButton.style.display = "block";
    console.log("handle audio called");
    const music = new Audio(audioPath);
    music.play();
    
  }
  stopmusic(){
    this.stopmusicButton.style.display = "none";
    this.playmusicButton.style.display = "block";
    music.pause();
    music.currentTime = 0;
    this.mode="card";
    console.log(this.mode);
  }
  
  showCard(card) {
    if(this.mode==="stage" || this.mode==="card" || this.mode==="audio")
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
    this.backButton.style.display = "none";
    this.backButtonCard.style.display = "block";
    this.playmusicButton.style.display = "block";
    this.stopmusicButton.style.display = "none";
    this.mode = "card";
    console.log(this.mode);
  }

  hideCard() {
    
    if (!this.activeCardMesh) return;
    const cardtohide = this.activeCardMesh;

    gsap.to(cardtohide.scale,
       {
      
      x: 0.1, y: 0.1, z: 0.1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        
         cardtohide.visible = false;
       
        this.activeCardMesh = null;
      }
    });

    this.backButtonCard.style.display = "none";
    this.backButton.style.display = "block";
    this.playmusicButton.style.display = "none";
    this.stopmusicButton.style.display = "none";
    this.mode = "instruments";
    console.log(this.mode);
  }
  
}

// Note: The above code assumes that the card models are already added to the scene and mapped to their respective instruments using addCard method.
