import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";

const MARKETPLACE = ".claude-plugin/marketplace.json";
const PLUGIN_JSON = "plugins/ideation-copilot/.claude-plugin/plugin.json";
const CODEX_PLUGIN_JSON = "plugins/ideation-copilot/.codex-plugin/plugin.json";
const PACKAGE_JSON = "package.json";

describe("version consistency", () => {
  const marketplace = JSON.parse(readFileSync(MARKETPLACE, "utf-8"));
  const plugin = JSON.parse(readFileSync(PLUGIN_JSON, "utf-8"));
  const codex = JSON.parse(readFileSync(CODEX_PLUGIN_JSON, "utf-8"));
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf-8"));
  const version = marketplace.plugins[0].version;

  test("marketplace.json metadata.version matches plugins[0].version", () => {
    expect(marketplace.metadata.version).toBe(version);
  });

  test("claude plugin.json version matches marketplace.json", () => {
    expect(plugin.version).toBe(version);
  });

  test("codex plugin.json version matches marketplace.json", () => {
    expect(codex.version).toBe(version);
  });

  test("package.json version matches marketplace.json", () => {
    expect(pkg.version).toBe(version);
  });

  test("version is a valid semver", () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("package.json declares Pi skills path that exists", () => {
    const skills = pkg.pi?.skills;
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
    for (const p of skills) {
      expect(existsSync(p)).toBe(true);
    }
  });
});
