import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"; // ✅ correct import
import { updateLoadingProgress } from "../utils/loadingScreen.js";

export async function loadModels(scene) {
  const loader = new GLTFLoader();

  // ✅ Setup Draco decoder
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  loader.setDRACOLoader(dracoLoader);

  // ✅ Vite will turn these into URLs
  const modelFiles = import.meta.glob("/src/model/*-draco.glb", { eager: true });

  const files = Object.keys(modelFiles);
  const total = files.length;
  let loaded = 0;

  const models = {};

  for (let path of files) {
    const fileUrl = modelFiles[path].default;
    const name = fileUrl.split("/").pop().replace("-draco.glb", "");

    try {
      const gltf = await loader.loadAsync(fileUrl);
      const model = gltf.scene;

      models[name] = model;
      scene.add(model);

      console.log(`✅ Loaded ${name} (Draco Compressed)`);

      loaded++;
      const percent = Math.round((loaded / total) * 100);
      updateLoadingProgress(percent);
    } catch (err) {
      console.error(`❌ Failed to load ${name}`, err);
    }
  }

  return models;
}
