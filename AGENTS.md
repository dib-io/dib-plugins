# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. This is an
open-source [Claude Code](https://code.claude.com) plugin marketplace for
[Dib](https://dib.io). Keep it small, correct, and trustworthy — people install this into
their own assistants.

## What this repo is

A marketplace that ships the `dib` plugin, which wires Claude into a user's Dib home via the
Dib MCP server (`https://dib.io/api/mcp`). There is **no application runtime here** — the
repo is configuration, commands, skills, agents, and docs. The "code" is mostly Markdown
and JSON.

## Repository layout

```
.claude-plugin/marketplace.json   # Marketplace manifest (lists plugins)
plugins/dib/
  .claude-plugin/plugin.json       # Plugin manifest (name, version, userConfig)
  .mcp.json                        # MCP server definition (http endpoint + auth header)
  commands/*.md                    # Slash commands (frontmatter: description)
  agents/*.md                      # Subagents (frontmatter: name, description)
  skills/<name>/SKILL.md           # Skills (frontmatter: name, description)
scripts/validate-plugins.mjs       # Structural validation (no network)
.github/workflows/validate.yml     # CI: runs the validator on push/PR
```

## Golden rules

1. **Verify tool names and scopes against the live docs before writing about them.** The
   `dib_*` tools and their `:read`/`:write` scopes are defined by the server, not this repo.
   Source of truth: <https://dib.io/developers/mcp>. Never invent tool names.
2. **Never commit secrets.** API keys (`dib_live_*`, `dib_test_*`) belong in the user's
   keychain via `userConfig`, never in files, examples, or commit history. Use
   `dib_live_...` style placeholders in docs.
3. **Validation must pass.** Run `node scripts/validate-plugins.mjs` (or
   `bun run scripts/validate-plugins.mjs`) before committing. CI runs the same check.
4. **Keep it minimal.** Don't add dependencies, build steps, or runtime code without a
   strong reason. This repo should stay installable and auditable at a glance.
5. **Plain language for users.** Commands, skills, and agents must explain auth/scope
   failures in human terms — never tell the end user to read raw error codes.

## Conventions

### Commands (`plugins/dib/commands/*.md`)
- Frontmatter with a single-sentence `description`.
- Body is the instruction Claude follows. State clearly whether the command is read-only or
  may write, and require confirmation before writes.
- Always read before writing (search/list before any `dib_create_*` / `dib_update_*`) to
  avoid duplicates.
- Degrade gracefully when a scope is missing: do the read-only part and name the scope the
  user needs.

### Skills (`plugins/dib/skills/<name>/SKILL.md`)
- Frontmatter `name` and `description`. The `description` is a trigger — say *when* to use
  the skill, not just what it is.
- Teach durable workflows and conventions, not one-off answers.

### Agents (`plugins/dib/agents/*.md`)
- Frontmatter `name` and `description`. Leave `tools` unset unless you have verified the
  exact MCP tool namespacing in a live session — getting it wrong silently breaks the agent.

### Manifests
- `name` in `plugin.json` must match the marketplace entry's `name`.
- Keep `keywords`, `description`, and the README tool table consistent with reality.

## Versioning & changelog

- Semantic Versioning. Bump the `version` in **both** `.claude-plugin/marketplace.json`
  (metadata) and `plugins/dib/.claude-plugin/plugin.json` together.
- Every user-facing change gets a `CHANGELOG.md` entry under a new version heading.
- `patch`: docs/wording fixes. `minor`: new commands/skills/agents. `major`: breaking
  changes to install flow, plugin name, or required config.

## Commits & pull requests

- Write concise, imperative commit subjects describing the "why" (e.g. "Add inventory-audit
  command"). Keep commits scoped — don't mix unrelated changes.
- Don't commit `.DS_Store`, logs, or editor cruft (see `.gitignore`).
- Branch from `main` using a descriptive name; open PRs against `main`. Ensure the validate
  workflow is green before requesting review.

## Local checks

```shell
node scripts/validate-plugins.mjs   # or: bun run scripts/validate-plugins.mjs
```

This validates JSON shape, cross-references (sources exist, names match), and that every
command/agent/skill has the required frontmatter. It needs no network access.
