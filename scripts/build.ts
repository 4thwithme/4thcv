import fs from "node:fs";
import path from "node:path";

const ROOT = "./root";
const PROJECT_DIR = `${__dirname}/../`;

// helpers -------------------------
const createRootDir = async (): Promise<void> => {
  try {
    const isBuidDirExists = fs.existsSync(ROOT);
    if (isBuidDirExists) await removeDirectory("root");
    await createDirectory("root");
  } catch (error) {
    console.error(error);
  }
};

async function createDirectory(pathname: string): Promise<void> {
  return new Promise((res, rej) => {
    try {
      const PATH = path.resolve(PROJECT_DIR, pathname);
      fs.mkdir(PATH, { recursive: true }, (err) => {
        if (err) rej(err);
        console.log(`[createDirectories]: created dir: ${PATH}`);
        res();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

async function removeDirectory(pathname: string): Promise<void> {
  return new Promise((res, rej) => {
    try {
      const PATH = path.resolve(PROJECT_DIR, pathname);
      fs.rm(PATH, { recursive: true, force: true }, (err) => {
        if (err) rej(err);
        console.log(`[removeDirectory]: removed dir: ${PATH}`);
        res();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

async function copyIndexHtml(): Promise<void> {
  return new Promise((res, rej) => {
    try {
      const PATH = path.resolve(PROJECT_DIR, "index.html");
      const DEST = path.resolve(PROJECT_DIR, "root/index.html");
      fs.copyFile(PATH, DEST, (err) => {
        if (err) rej(err);
        console.log("[copyIndexHtml]: copied index.html");
        res();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

async function copyRootFiles(): Promise<void> {
  return new Promise(async (res, rej) => {
    try {
      const FILES = [".htaccess"];

      await Promise.all(
        FILES.map((FILE) => {
          fs.copyFile(
            path.resolve(PROJECT_DIR, FILE),
            path.resolve(PROJECT_DIR, "root", FILE),
            (err) => {
              if (err) rej(err);
              console.log(`[copyIndexHtml]: copied ${FILE}`);
            }
          );
        })
      );

      res();
    } catch (error) {
      console.error(error);
    }
  });
}

async function copyAssets(): Promise<void> {
  return new Promise((res, rej) => {
    try {
      const PATH = path.resolve(PROJECT_DIR, "src/assets");
      const DEST = path.resolve(PROJECT_DIR, "root/src/assets");
      fs.cp(PATH, DEST, { recursive: true }, (err) => {
        if (err) rej(err);
        console.log("[copyIndexHtml]: copied assets");
        res();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

async function copyStyles(): Promise<void> {
  return new Promise((res, rej) => {
    try {
      const PATH = path.resolve(PROJECT_DIR, "src/styles");
      const DEST = path.resolve(PROJECT_DIR, "root/src/styles");
      fs.cp(
        PATH,
        DEST,
        {
          recursive: true,
          filter: (source) =>
            source.endsWith("/index.css") ||
            source.endsWith("/reset.css") ||
            source.endsWith("/styles"),
        },
        (err) => {
          if (err) rej(err);
          console.log("[copyIndexHtml]: copied styles");
          res();
        }
      );
    } catch (error) {
      console.error(error);
    }
  });
}

// script -------------------------------
(async () => {
  await createRootDir();
  await copyIndexHtml();
  await copyRootFiles();
  await copyAssets();
  await copyStyles();
})();
