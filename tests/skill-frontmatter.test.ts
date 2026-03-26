import { describe, test, expect } from "bun:test";
import { globSync } from "fs";
import { readFileSync } from "fs";

const PLUGIN_DIR = "plugins/ideation-copilot/skills";
const REQUIRED_FIELDS = ["name", "description", "disable-model-invocation", "allowed-tools"];

const skillFiles = globSync(`${PLUGIN_DIR}/*/SKILL.md`);

// Simple frontmatter parser that handles unquoted YAML values (like argument-hint with special chars)
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      data[key] = value;
    }
  }
  return data;
}

describe("skill frontmatter", () => {
  test("at least one skill exists", () => {
    expect(skillFiles.length).toBeGreaterThan(0);
  });

  for (const file of skillFiles) {
    describe(file, () => {
      const content = readFileSync(file, "utf-8");
      const data = parseFrontmatter(content);

      test("has valid frontmatter block", () => {
        expect(content.startsWith("---\n")).toBe(true);
      });

      for (const field of REQUIRED_FIELDS) {
        test(`has required field: ${field}`, () => {
          expect(data[field]).toBeDefined();
          expect(data[field].trim()).not.toBe("");
        });
      }
    });
  }
});
