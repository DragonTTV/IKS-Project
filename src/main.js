import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function animate(){
    requestAnimationFrame(animate)
    // console.log(camera.position)
    controls.update()
    renderer.render(scene, camera)
}

animate()   