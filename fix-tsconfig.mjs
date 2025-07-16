import fs from "fs";
const tsconfig = "./tsconfig.json";
const config = JSON.parse(fs.readFileSync(tsconfig, "utf-8"));
if (Array.isArray(config.include)) {
  config.include = config.include.filter(
    (line) => line !== ".next/types/**/*.ts",
  );
  fs.writeFileSync(tsconfig, JSON.stringify(config, null, 2));
}
