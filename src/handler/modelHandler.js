import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadModels(scene){
    const loader = new GLTFLoader();


    const modelFiles = import.meta.glob("/src/model/*.glb", {eager: true});
    console.log(modelFiles)
    const models = {};
    for(let path in modelFiles){
        const fileUrl = modelFiles[path].default; 
        const name = fileUrl.split('/').pop().replace('.glb', '')
        
       

        try {
            const gltfLoader = await loader.loadAsync(fileUrl);
            const model = gltfLoader.scene;

            models[name] = model
            scene.add(model)
            console.log(`Loaded ${name}`)
            
            
        }catch(err){
            console.error(`Failed to load ${name}`, err)
        }
    }
    return models;
}