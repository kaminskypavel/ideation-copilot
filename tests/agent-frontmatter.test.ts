import { describe, test, expect } from "bun:test";
import { globSync } from "fs";
import { readFileSync } from "fs";
import matter from "gray-matter";

const AGENTS_DIR = "plugins/ideation-copilot/agents";
const REQUIRED_FIELDS = ["name", "description"];

const agentFiles = globSync(`${AGENTS_DIR}/**/*.md`);

describe("agent frontmatter", () => {
  test("at least one agent exists", () => {
    expect(agentFiles.length).toBeGreaterThan(0);
  });

  for (const file of agentFiles) {
    describe(file, () => {
      const content = readFileSync(file, "utf-8");
      const { data } = matter(content);

      test("has valid YAML frontmatter", () => {
        expect(data).toBeDefined();
        expect(typeof data).toBe("object");
      });

      for (const field of REQUIRED_FIELDS) {
        test(`has required field: ${field}`, () => {
          expect(data[field]).toBeDefined();
          expect(String(data[field]).trim()).not.toBe("");
        });
      }
    });
  }
});
