import { describe, test, expect } from "bun:test";
import { globSync, existsSync } from "fs";
import { readFileSync } from "fs";
import { join, dirname } from "path";

const PLUGIN_DIR = "plugins/ideation-copilot";

// Find all skill and agent markdown files
const mdFiles = [
  ...globSync(`${PLUGIN_DIR}/skills/*/SKILL.md`),
  ...globSync(`${PLUGIN_DIR}/agents/**/*.md`),
];

// Extract file paths from markdown code blocks that look like relative paths
// Matches lines in code blocks that look like: references/something.md, ideas/something/file.md
const PATH_PATTERN = /^(references\/[\w-]+\.md|ideas\/[\w-]+\/[\w-]+\.md)$/;

function extractReferencedPaths(content: string): string[] {
  const paths: string[] = [];
  const codeBlockRegex = /```\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const block = match[1];
    for (const line of block.split("\n")) {
      const trimmed = line.trim();
      if (PATH_PATTERN.test(trimmed)) {
        paths.push(trimmed);
      }
    }
  }

  return paths;
}

describe("reference integrity", () => {
  for (const file of mdFiles) {
    const content = readFileSync(file, "utf-8");
    const referencedPaths = extractReferencedPaths(content);

    if (referencedPaths.length > 0) {
      describe(file, () => {
        for (const refPath of referencedPaths) {
          test(`referenced path exists: ${refPath}`, () => {
            const fullPath = join(PLUGIN_DIR, refPath);
            expect(existsSync(fullPath)).toBe(true);
          });
        }
      });
    }
  }
});
