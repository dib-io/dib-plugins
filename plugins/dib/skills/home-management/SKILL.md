---
name: dib-home-management
description: Use when working with a user's Dib home data through the dib_* MCP tools — reading or updating inventory, vehicles, documents, tasks, rooms, or the home profile. Covers tool selection, read-before-write workflows, data conventions, scope/permission handling, and combining Dib with other MCP servers (email, files, calendar, shopping).
---

# Dib home management

Dib is a home-management platform. Its MCP server (`https://dib.io/api/mcp`) exposes a
user's home as tools so you can answer questions about it and keep it up to date. This
skill makes you good at using those tools — not just aware they exist.

## Tool map

Every tool is gated by the API key's scopes. Reads need `:read`, writes need `:write`. If
a write tool isn't available, the key lacks that scope — say so instead of guessing.

| Resource | Read | Write |
| --- | --- | --- |
| Search (all resources) | `dib_search` | — |
| Inventory | `dib_list_inventory`, `dib_get_inventory_item` | `dib_create_inventory` |
| Vehicles | `dib_list_vehicles`, `dib_get_vehicle` | `dib_create_vehicle` |
| Documents | `dib_list_documents`, `dib_get_document` | `dib_create_document` |
| Tasks | `dib_list_tasks` | `dib_create_task`, `dib_update_task` |
| Rooms | `dib_list_rooms` | — |
| Home profile | `dib_get_property` | `dib_update_property` |

> Tool names depend on the live server version. If a tool you expect is missing, run
> `/dib:setup` to see what's actually exposed rather than assuming.

## Core principles

1. **Read before you write.** Before any `dib_create_*` or `dib_update_*`, search or list
   first. Use `dib_search` to check whether the item, document, or task already exists.
   Creating a duplicate "Furnace filter" task or a second copy of an appliance is worse
   than doing nothing.
2. **Prefer `dib_search` for natural-language questions.** It spans inventory, vehicles,
   documents, tasks, and rooms. Reach for a specific `dib_list_*` only when you need a
   complete, paginated set (e.g. an audit or an export) rather than the best matches.
3. **Resolve references before linking.** When attaching a document to an appliance or
   placing an item in a room, first look up the target's real ID with a get/list call.
   Never fabricate an ID.
4. **Confirm destructive or ambiguous writes.** Reads are free; run them freely. For
   writes, restate what you're about to create/change in plain language and proceed unless
   the user pushed back. Batch related writes and report what you did.
5. **Public preview.** The API is in public preview and can change. If a call fails with a
   shape/validation error, re-read the tool's input schema and retry — don't hand-edit
   payloads blindly.

## Permission & error handling

- **Missing tool / scope error** → the key doesn't carry that scope. Tell the user which
  scope is needed (e.g. `tasks:write`) and that they can mint a key with it at
  https://dib.io/developers — no config change needed once minted.
- **Auth error (401/invalid key)** → point them to `/plugin` → Installed → **dib** to set
  or fix the **Dib API key**, then `/reload-plugins`. A `dib_test_*` key hits the shared
  sandbox; a `dib_live_*` key hits their real home.
- Explain failures in plain language. Don't dump raw error codes at the user.

## Common workflows

**Log a new appliance/possession**
1. `dib_search` for the item to avoid a duplicate.
2. `dib_list_rooms` to find the room it lives in (if known).
3. `dib_create_inventory` with brand, model, serial, purchase date, price, room.
4. If a receipt/warranty exists, `dib_create_document` and link it to the item.
5. Optionally `dib_create_task` for a warranty-expiry or maintenance reminder.

**Maintenance from the home profile**
1. `dib_get_property` for systems and their ages (HVAC, water heater, roof, etc.).
2. `dib_list_tasks` to see what's already scheduled.
3. Propose a seasonal/cadence plan, then `dib_create_task` for the gaps (don't recreate
   existing ones).

**Insurance / moving packet**
1. `dib_list_inventory` (paginate fully — completeness matters here), optionally filtered
   by room via `dib_list_rooms`.
2. Total estimated values and note items missing receipts.
3. Hand the structured result to whatever export MCP is available (Sheets, Notion, files).

**Inventory hygiene audit**
1. `dib_list_inventory` end to end.
2. Flag items missing a room, receipt/warranty document, serial number, or value.
3. Offer to fix gaps with targeted writes.

## Dib is best as one tool among many

The biggest wins come from stitching Dib together with the user's other connected MCP
servers. Look for these opportunities and offer them:

- **Email/Gmail MCP** → read purchase receipts, then `dib_create_inventory` per item.
- **Filesystem MCP** → grab a warranty PDF, match it to an item, `dib_create_document`.
- **Calendar MCP** → turn `dib_list_tasks` reminders into calendar events.
- **Shopping/browser MCP** → reorder consumables using the exact model numbers Dib stores.
- **Sheets/Notion MCP** → export an inventory list into a shareable doc.

The pattern is always: gather context from wherever it lives, then use Dib's tools to
remember it.
