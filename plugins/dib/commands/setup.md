---
description: Verify the Dib MCP connection and show what Claude can now do with your home data.
---

The Dib plugin is installed. Help me confirm it's working.

1. Check whether the `dib` MCP server's tools are available in this session (tools are prefixed `dib_`, e.g. `dib_search`, `dib_list_inventory`).
2. If the tools are NOT available:
   - The most common cause is a missing or invalid API key. Tell me to set my Dib API key by running `/plugin` → Installed → **dib** → and filling in the **Dib API key** field, then `/reload-plugins`.
   - I can get a key at https://dib.io/developers (a `dib_live_*` key for my real home, or a `dib_test_*` key for the shared sandbox).
3. If the tools ARE available, run a quick read-only check by calling `dib_get_property` (and `dib_search` with a simple query if helpful) to confirm we can reach my home data, then give me a short summary of what I can ask for next, such as:
   - "What's in my garage?" (inventory)
   - "When is my car insurance due?" (vehicles)
   - "Add a task to replace the furnace filter" (tasks)
   - "What HVAC system does my home have?" (home profile)

Keep it friendly and brief. If anything fails with an auth or scope error, explain the fix in plain language rather than showing raw error codes.
