import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100


const scene = new THREE.Scene();
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true


const ambiLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambiLight)

const cubemat = new THREE.MeshStandardMaterial({ color: 0xffffff })
const cubegeom= new THREE.BoxGeometry(5,5,5)
const cube = new THREE.Mesh(cubegeom,cubemat)
cube.position.set(285,0,0)
cube.material.transparent = true;
cube.material.opacity = 0.5
camera.position.set(275,0,0)
camera.lookAt(cube)

// console.log(cube.position)
scene.add(cube)
camera.rotation.y = -Math.PI/2
//
const gltfLoader = new GLTFLoader()
gltfLoader.load("/src/model/theatre.glb", (gltfscene) => {
    scene.add(gltfscene.scene)
    gltfscene.scene.scale.set(15,15,15)
})
//
gltfLoader.load("/src/model/pillow.glb", (gltfscene) => {
    gltfscene.scene.position.set(15,0,-10)
    gltfscene.scene.scale.set(0.1, 0.079, 0.07)
    gltfscene.scene.rotation.y = Math.PI/2
    
    console.log(`Scale`, gltfscene.scene.scale)
    scene.add(gltfscene.scene)

    
})
//
gltfLoader.load("/src/model/microphone.glb", (gltfscene) => {
    scene.add(gltfscene.scene)
    
})
//
gltfLoader.load("/src/model/carpet.glb", (gltfscene) => {
    scene.add(gltfscene.scene)
    
})


//Something

function animate(){
    requestAnimationFrame(animate)
    
    renderer.render(scene, camera)
}

//new something
animate()  

 

