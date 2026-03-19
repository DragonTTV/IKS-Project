// scripts/generate-model-list.js
import fs from "fs";
import path from "path";

const modelsDir = path.resolve("public/assets/model");
const outputFile = path.resolve("public/assets/models.json");

// 👉 Define defaults (can be customized per model)
const defaultTransform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

function generateModelList() {
  if (!fs.existsSync(modelsDir)) {
    console.error("❌ Models folder not found:", modelsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith(".glb"));

  const data = {};

  for (const file of files) {
    const name = path.basename(file, ".glb"); // remove extension
    data[name] = {
      path: `/assets/model/${file}`,
      ...defaultTransform
    };
  }

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

  console.log(`✅ models.json generated with ${files.length} models`);
}

generateModelList();
