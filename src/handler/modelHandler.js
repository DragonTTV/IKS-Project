import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { updateLoadingProgress, enableCurtains } from "../utils/loadingScreen";
export async function loadModels(scene){
    const loader = new GLTFLoader();
    const modelFiles = import.meta.glob("/src/model/*.glb", {eager: true});
    // console.log(modelFiles)

    const files = Object.keys(modelFiles);
    const total = files.length;
    let loaded = 0;

    const models = {};

    for(let path of files){
        const fileUrl = modelFiles[path].default; 
        const name = fileUrl.split('/').pop().replace('.glb', '');
        
       

        try {
            const gltfLoader = await loader.loadAsync(fileUrl);
            const model = gltfLoader.scene;

            models[name] = model;
            scene.add(model);
            console.log(`Loaded ${name}`);
            
            loaded++;
            let percent = Math.round((loaded/total)*100)
            updateLoadingProgress(percent)

        }catch(err){
            console.error(`Failed to load ${name}`, err)
        }
    }

    enableCurtains();
    return models;
}