import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { updateLoadingProgress } from "../utils/loadingScreen.js";

export async function loadModels(scene, renderer) {
  const loader = new GLTFLoader();

  // ✅ Draco
  const dracoLoader = new DRACOLoader();
  //dracoLoader.setDecoderPath("/IKS-Project/draco/"); // public/draco/*
  dracoLoader.setDecoderPath("/draco/"); // public/draco/*
  loader.setDRACOLoader(dracoLoader);

  // ✅ KTX2
  const ktx2Loader = new KTX2Loader()
    //.setTranscoderPath("/IKS-Project/basis/") // public/basis/*
    .setTranscoderPath("/basis/") // public/basis/*
    .detectSupport(renderer);
  loader.setKTX2Loader(ktx2Loader);

  // ✅ Fetch metadata from models.json
  //const res = await fetch("/assets/model.json"); //Dev Testing
  const res = await fetch("/assets/models.json"); //Deployment(add iks project for deployment)
  if (!res.ok) throw new Error("❌ Could not load models.json");
  const modelData = await res.json();

  const entries = Object.entries(modelData);
  const total = entries.length;
  let loaded = 0;

  const models = {};

  for (const [name, { path, position, rotation, scale,type }] of entries) {
    try {
      const gltf = await loader.loadAsync(path);
      const model = gltf.scene;

      if (position) model.position.set(...position);
      if (rotation) model.rotation.set(...rotation);
      if (scale) model.scale.set(...scale);
      model.userData = {
  type: type || "other", 
  name: name             
};
      //  if (name.toLowerCase().includes("card")) {
      //   model.userData.type = "card";
      //   model.visible = false; // hide cards at start
      // } else if (["pillow", "pillowleft", "pillowright"].includes(name.toLowerCase())) {
      //   model.userData.type = "pillow";
      // } else if (name !== "theater" && name !== "carpet" && !name.toLowerCase().includes("mic")) {
      //   model.userData.type = "instrument";
      // } else {
      //   model.userData.type = "other";
      // }

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
