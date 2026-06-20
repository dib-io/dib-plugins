#!/usr/bin/env node
// Structural validation for the Dib plugin marketplace.
// No network access required: validates JSON shape, cross-references, and
// markdown frontmatter so a malformed manifest can't ship.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const error = (msg) => errors.push(msg);

function readJson(relPath) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) {
    error(`Missing file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch (e) {
    error(`Invalid JSON in ${relPath}: ${e.message}`);
    return null;
  }
}

function hasFrontmatter(absPath, requiredKeys) {
  const text = readFileSync(absPath, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return `missing YAML frontmatter`;
  const block = match[1];
  const missing = requiredKeys.filter(
    (k) => !new RegExp(`^${k}\\s*:`, "m").test(block),
  );
  return missing.length ? `frontmatter missing: ${missing.join(", ")}` : null;
}

function walkForSkills(dir, found) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkForSkills(abs, found);
    else if (entry === "SKILL.md") found.push(abs);
  }
}

// --- marketplace.json ---
const marketplace = readJson(".claude-plugin/marketplace.json");
if (marketplace) {
  for (const key of ["name", "owner", "plugins"]) {
    if (!(key in marketplace)) error(`marketplace.json missing "${key}"`);
  }
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    error(`marketplace.json "plugins" must be a non-empty array`);
  }

  for (const entry of marketplace.plugins ?? []) {
    for (const key of ["name", "source", "description"]) {
      if (!entry?.[key]) error(`plugin entry "${entry?.name ?? "?"}" missing "${key}"`);
    }
    if (!entry?.source) continue;

    const pluginDir = join(root, entry.source);
    if (!existsSync(pluginDir)) {
      error(`plugin "${entry.name}" source not found: ${entry.source}`);
      continue;
    }

    // --- plugin.json ---
    const manifestPath = join(entry.source, ".claude-plugin", "plugin.json");
    const manifest = readJson(manifestPath);
    if (manifest) {
      for (const key of ["name", "version", "description"]) {
        if (!manifest[key]) error(`${manifestPath} missing "${key}"`);
      }
      if (manifest.name !== entry.name) {
        error(
          `name mismatch: marketplace entry "${entry.name}" vs plugin.json "${manifest.name}"`,
        );
      }
    }

    // --- .mcp.json (optional but must be valid if present) ---
    const mcpRel = join(entry.source, ".mcp.json");
    if (existsSync(join(root, mcpRel))) {
      const mcp = readJson(mcpRel);
      if (mcp && !mcp.mcpServers) error(`${mcpRel} missing "mcpServers"`);
    }

    // --- commands ---
    const commandsDir = join(pluginDir, "commands");
    if (existsSync(commandsDir)) {
      for (const file of readdirSync(commandsDir).filter((f) => f.endsWith(".md"))) {
        const problem = hasFrontmatter(join(commandsDir, file), ["description"]);
        if (problem) error(`commands/${file}: ${problem}`);
      }
    }

    // --- agents ---
    const agentsDir = join(pluginDir, "agents");
    if (existsSync(agentsDir)) {
      for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
        const problem = hasFrontmatter(join(agentsDir, file), ["name", "description"]);
        if (problem) error(`agents/${file}: ${problem}`);
      }
    }

    // --- skills ---
    const skills = [];
    walkForSkills(join(pluginDir, "skills"), skills);
    for (const skillPath of skills) {
      const problem = hasFrontmatter(skillPath, ["name", "description"]);
      if (problem) error(`${skillPath.replace(root + "/", "")}: ${problem}`);
    }
  }
}

if (errors.length) {
  console.error(`✗ Plugin validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ Plugin marketplace is valid.");
