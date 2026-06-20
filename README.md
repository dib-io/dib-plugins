# Dib plugins for Claude Code

Official [Claude Code](https://code.claude.com) plugins for [Dib](https://dib.io), the AI-powered home management platform. The `dib` plugin wires Claude straight into your home: inventory, vehicles, documents, tasks, rooms, and your home profile, through the Dib MCP server.

## Install

From inside Claude Code:

```shell
/plugin marketplace add dib-io/dib-plugins
/plugin install dib@dib
```

When you enable the plugin, Claude Code prompts you for your **Dib API key** and stores it in your system keychain. Grab a key at [dib.io/developers](https://dib.io/developers):

- `dib_live_*` — your real home data
- `dib_test_*` — the shared sandbox/demo home, great for trying things out

Then confirm everything's wired up:

```shell
/dib:setup
```

## What you can ask

Once connected, just talk to Claude about your home:

- "What's in my garage?"
- "When is my car insurance due?"
- "Add a task to replace the furnace filter next month."
- "What HVAC system does my home have, and how old is it?"
- "Find the receipt for my dishwasher."

## What's included

The plugin bundles the Dib MCP server (`https://dib.io/api/mcp`). The tools Claude can use depend on your API key's scopes:

| Tool | Scope | What it does |
| --- | --- | --- |
| `dib_search` | `search:read` | Search across inventory, vehicles, documents, tasks, rooms |
| `dib_list_inventory` / `dib_get_inventory_item` | `inventory:read` | Browse and read inventory |
| `dib_create_inventory` | `inventory:write` | Add inventory items |
| `dib_list_vehicles` / `dib_get_vehicle` | `vehicles:read` | Browse and read vehicles |
| `dib_create_vehicle` | `vehicles:write` | Add a vehicle |
| `dib_list_documents` / `dib_get_document` | `documents:read` | Browse and read documents |
| `dib_create_document` | `documents:write` | Attach a document |
| `dib_list_tasks` | `tasks:read` | List tasks |
| `dib_create_task` / `dib_update_task` | `tasks:write` | Create and update tasks |
| `dib_list_rooms` | `rooms:read` | List rooms |
| `dib_get_property` | `property:read` | Read your home profile |
| `dib_update_property` | `property:write` | Update your home profile |

## Manage the plugin

```shell
/plugin               # open the plugin manager (Installed tab to edit your API key)
/reload-plugins       # apply changes without restarting
/plugin uninstall dib@dib
```

## Links

- Docs: https://dib.io/developers
- MCP reference: https://dib.io/developers/mcp
- Auth: https://dib.io/developers/auth
- Support: developers@dib.io

## License

MIT — see [LICENSE](./LICENSE).
