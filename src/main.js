import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const ambiLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambiLight)

const cubemat = new THREE.MeshNormalMaterial()
const cubegeom= new THREE.BoxGeometry(5,5,5)
const cube = new THREE.Mesh(cubegeom,cubemat)
cube.position.set(15,0,0)
console.log(cube.position)
scene.add(cube)
const gltfLoader = new GLTFLoader()
gltfLoader.load("/src/model/theater/scene.gltf", (gltfscene) => {
    scene.add(gltfscene.scene)
    gltfscene.scene.scale.set(15,15,15)
    
})


//Something

function animate(){
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

//new something
animate()  

 

