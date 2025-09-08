import * as THREE from "three";
//import { OrbitControls, RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import {RectAreaLightHelper} from "three/examples/jsm/Addons.js";

import { loadModels } from "./handler/modelHandler";
import { PI } from "three/tsl";
import { CameraHandler, cameraHandler1 } from "./handler/camerahandler.js";
import { ClickHandler } from "./handler/clickhandler.js";
//renderer
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
// camera.position.x = 385;
// camera.position.z = 100;
camera.rotation.y = -Math.PI/2;
camera.position.set(0,5,0)

const scene = new THREE.Scene();
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;

//dummy targets 
const stagecubemat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const stagecubegeom= new THREE.BoxGeometry(5,5,5);
const stagecube = new THREE.Mesh(stagecubegeom,stagecubemat);

const seatscubemat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const seatscubegeom= new THREE.BoxGeometry(5,5,5);
const seatscube = new THREE.Mesh(seatscubegeom,seatscubemat);

stagecube.position.set(350.8986681999935,  44.18452249208729,  8.335760422847635);
scene.add(stagecube);
scene.add(seatscube);
stagecube.visible = false;
seatscube.visible = false;

(async () => {
  try {
    const models = await loadModels(scene);
    
    //Theatre
    models.theater1.scale.set(30, 30, 30);
    //Carpet
    models.carpet.scale.set(40,50,50);
    models.carpet.position.set(478,-19.5,0);
    //Pillows
    models.pillow.scale.set(1, 0.632, 0.56);
    models.pillow.position.set(508,-15.7,3);
    models.pillow.rotation.y = Math.PI/2;

    models.pillowleft.scale.set(0.6, 0.632, 0.56);
    models.pillowleft.position.set(454,-15.7,-94);
    models.pillowleft.rotation.y = -Math.PI/6

    models.pillowright.scale.set(0.6, 0.632, 0.56);
    models.pillowright.position.set(454,-15.7, 100);
    models.pillowright.rotation.y = Math.PI/6
    //Microphones
   models.microphone.position.set(458,-15.7,3) 
   models.microphone.scale.set(20,10,20)
   models.microphone.rotation.y = Math.PI/2

   models.microphoneleft.position.set(440,-15.7,43) 
   models.microphoneleft.scale.set(20,10,20)
   models.microphoneleft.rotation.y = Math.PI/4

   models.microphoneright.position.set(440,-15.7,-40) 
   models.microphoneright.scale.set(20,10,20)
   models.microphoneright.rotation.y = 3*Math.PI/4

   // initialize handlers
    const camHandler = cameraHandler1.init(camera);
    const clickHandler = new ClickHandler(camera, renderer, scene, camHandler, stagecube);

    clickHandler.addPillow(models.pillow);
    clickHandler.addPillow(models.pillowleft);
    clickHandler.addPillow(models.pillowright);


    camHandler.introPan(seatscube, stagecube);
    


    console.log("✅ All models loaded:", models);
  } catch (err) {
    console.error("❌ Error while loading models:", err);
  }
})();

//Lights//

const ambiLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambiLight);

//SpotLight
// const spotLeft = new THREE.SpotLight(0xF5F5DC, 1, )
// spotLeft.position.set(508, 0, 0)
// spotLeft.scale.set(0.2,0.2,0.2)

// const spotLeftHelper = new THREE.SpotLightHelper(spotLeft, 0xffffff)
// scene.add(spotLeft, spotLeftHelper)

//Rectangular Area Light
const stageLight = new THREE.RectAreaLight(0xFFFFC5, 60, 80, 120)
stageLight.rotation.x = THREE.MathUtils.degToRad(-90);
stageLight.position.set(508, 290, 0)

const stageLightHelper = new RectAreaLightHelper(stageLight ,0xffffff)
scene.add(stageLight, stageLightHelper)

//cube
const cubemat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cubegeom= new THREE.BoxGeometry(5,5,5);
const cube = new THREE.Mesh(cubegeom,cubemat);
cube.position.set(585,0,0);
cube.material.transparent = true;
cube.visible = false;
scene.add(cube);




function animate(){
    requestAnimationFrame(animate)
    //controls.update()
    //console.log(camera.position)
    renderer.render(scene, camera)
}


animate()  

 

