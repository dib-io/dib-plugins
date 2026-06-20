# Changelog

All notable changes to the Dib plugins are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-06-19

### Added

- **Home-management skill** (`skills/home-management`) that teaches Claude how to use the
  `dib_*` tools well: read-before-write workflows, scope/permission handling, data
  conventions, and combining Dib with other MCP servers.
- **Workflow commands**: `/dib:home-summary`, `/dib:maintenance-plan`, and
  `/dib:inventory-audit`.
- **`home-manager` subagent** — a home-management concierge scoped to the Dib tools.
- **CI validation** (`scripts/validate-plugins.mjs` + GitHub Actions workflow) that checks
  the marketplace/plugin manifests and command, agent, and skill frontmatter on every PR.
- **`AGENTS.md`** with contributor standards for the open-source repo (layout, conventions,
  versioning, and validation).

## [1.0.0]

### Added

- Initial Dib plugin marketplace.
- `dib` plugin bundling the Dib MCP server (`https://dib.io/api/mcp`) with an API-key
  user config and a `/dib:setup` connectivity-check command.
