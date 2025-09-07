import * as THREE from "three";
import { OrbitControls, RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { loadModels } from "./handler/modelHandler";

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
// camera.position.x = 385;
// camera.position.z = 100;
camera.rotation.y = -Math.PI/2;

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
(async () => {
  try {
    const models = await loadModels(scene);
    
    //Theatre
    models.theatre.scale.set(30, 30, 30);
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
    


    console.log("✅ All models loaded:", models);
  } catch (err) {
    console.error("❌ Error while loading models:", err);
  }
})();

//Lights

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


const cubemat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cubegeom= new THREE.BoxGeometry(5,5,5);
const cube = new THREE.Mesh(cubegeom,cubemat);
cube.position.set(585,0,0);
cube.material.transparent = true;
cube.material.opacity = 0.5;
camera.position.set(0,5,0);
// camera.lookAt(cube)

// console.log(cube.position)
scene.add(cube);


// gltfLoader.load("/src/model/pillow.glb", (gltfscene) => {
//     gltfscene.scene.position.set(15,0,-10)
//     gltfscene.scene.scale.set(0.1, 0.079, 0.07)
//     gltfscene.scene.rotation.y = Math.PI/2
    






function animate(){
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}


animate()  

 

