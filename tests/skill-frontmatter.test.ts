import { describe, expect, test } from "bun:test";
import { globSync, readFileSync } from "fs";
import matter from "gray-matter";

const SKILLS_DIR = "plugins/ideation-copilot/skills";
const REQUIRED_FIELDS = ["name", "description", "disable-model-invocation", "allowed-tools"];
const SKILL_NAME = /^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const skillFiles = globSync(`${SKILLS_DIR}/*/SKILL.md`);

describe("skill frontmatter", () => {
  test("at least one skill exists", () => {
    expect(skillFiles.length).toBeGreaterThan(0);
  });

  for (const file of skillFiles) {
    describe(file, () => {
      const content = readFileSync(file, "utf-8");
      const { data } = matter(content);

      test("has valid YAML frontmatter", () => {
        expect(content.startsWith("---\n")).toBe(true);
      });

      for (const field of REQUIRED_FIELDS) {
        test(`has required field: ${field}`, () => {
          expect(data[field]).toBeDefined();
          if (typeof data[field] === "string") {
            expect(data[field].trim()).not.toBe("");
          }
        });
      }

      test("has Pi-compatible name", () => {
        expect(data.name).toMatch(SKILL_NAME);
      });

      test("has nonempty description", () => {
        expect(data.description).toEqual(expect.any(String));
        expect(data.description.trim()).not.toBe("");
      });

      test("has string argument hint when declared", () => {
        if (data["argument-hint"] !== undefined) {
          expect(data["argument-hint"]).toEqual(expect.any(String));
        }
      });
    });
  }
});
