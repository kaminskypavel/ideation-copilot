import { describe, test, expect } from "bun:test";
import { globSync, existsSync, statSync } from "fs";
import { readFileSync } from "fs";

const PLUGIN_DIR = "plugins/ideation-copilot";
const CLAUDE_DIR = ".claude";
const SKIP_PREFIXES = [
  `${PLUGIN_DIR}/.claude-plugin/`,
  `${PLUGIN_DIR}/.codex-plugin/`,
];

const pluginFiles = globSync(`${PLUGIN_DIR}/**/*`).filter(
  (f) =>
    !SKIP_PREFIXES.some((p) => f.startsWith(p)) && statSync(f).isFile()
);

describe(".claude/ sync", () => {
  test("plugin has files to sync", () => {
    expect(pluginFiles.length).toBeGreaterThan(0);
  });

  for (const srcFile of pluginFiles) {
    const destFile = srcFile.replace(PLUGIN_DIR, CLAUDE_DIR);

    test(`${srcFile} → ${destFile}`, () => {
      expect(existsSync(destFile)).toBe(true);

      const srcContent = readFileSync(srcFile, "utf-8");
      const destContent = readFileSync(destFile, "utf-8");
      expect(srcContent).toBe(destContent);
    });
  }
});
