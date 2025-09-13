import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { updateLoadingProgress } from "../utils/loadingScreen.js";

export async function loadModels(scene, renderer) {
  const loader = new GLTFLoader();

  // ✅ Draco
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  // ✅ KTX2
  const ktx2Loader = new KTX2Loader()
    .setTranscoderPath("/basis/")
    .detectSupport(renderer);
  loader.setKTX2Loader(ktx2Loader);

  // ✅ Load metadata
  const res = await fetch("/assets/models.json");
  const modelData = await res.json();

  const entries = Object.entries(modelData);
  const total = entries.length;
  let loaded = 0;
  const models = {};

  for (const [name, { path, position, rotation, scale }] of entries) {
    try {
      // Directly load from /public/assets/model/
      const gltf = await loader.loadAsync(path);
      const model = gltf.scene;

      if (position) model.position.set(...position);
      if (rotation) model.rotation.set(...rotation);
      if (scale) model.scale.set(...scale);

      models[name] = model;
      scene.add(model);

      console.log(`✅ Loaded ${name}`);
      loaded++;
      updateLoadingProgress(Math.round((loaded / total) * 100));
    } catch (err) {
      console.error(`❌ Failed to load ${name}`, err);
    }
  }

  return models;
}
