import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";

const MARKETPLACE = ".claude-plugin/marketplace.json";
const PLUGIN_JSON = "plugins/ideation-copilot/.claude-plugin/plugin.json";

describe("version consistency", () => {
  const marketplace = JSON.parse(readFileSync(MARKETPLACE, "utf-8"));
  const plugin = JSON.parse(readFileSync(PLUGIN_JSON, "utf-8"));

  test("marketplace.json metadata.version matches plugins[0].version", () => {
    expect(marketplace.metadata.version).toBe(marketplace.plugins[0].version);
  });

  test("plugin.json version matches marketplace.json", () => {
    expect(plugin.version).toBe(marketplace.plugins[0].version);
  });

  test("version is a valid semver", () => {
    const version = marketplace.plugins[0].version;
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
