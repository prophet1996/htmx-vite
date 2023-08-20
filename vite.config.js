import fs from "fs/promises";
import { resolve, extname,sep } from "path";
import { defineConfig } from "vite";
const fileCache = new Map();

const rootTemplateDir = resolve(__dirname, "templates");
const rootDirLength = rootTemplateDir.split(sep).length
const fillNestedDir = async (currRootDir) => {
  const pathsEnt = await fs.readdir(currRootDir, { withFileTypes: true });
  for (const path of pathsEnt) {
    if (path.isFile() && extname(path.name) === ".html") {
      const fullFilePath = resolve(currRootDir, path.name);
      const cacheKey = fullFilePath.split(sep).slice(rootDirLength).join(sep);
      fileCache.set(cacheKey, fullFilePath);
    } else if (path.isDirectory()) {
      await fillNestedDir(resolve(currRootDir, path.name));
    }
  }
};
await fillNestedDir(rootTemplateDir);
const  rollUpInput = Object.fromEntries(fileCache)

export default defineConfig({
  build: {
    rollupOptions: {
      input: rollUpInput,
    },
  },
});
