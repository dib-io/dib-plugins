---
description: Build a seasonal home-maintenance plan from your Dib home profile and create the tasks.
---

Help me build a maintenance plan for my home from my Dib data.

1. Call `dib_get_property` to read my home's systems and their ages (HVAC, water heater,
   roof, gutters, appliances, etc.).
2. Call `dib_list_tasks` to see what maintenance is **already** scheduled, so we don't
   duplicate anything.
3. Propose a maintenance plan grouped by cadence (monthly / seasonal / annual), tailored to
   the systems my home actually has and their age. Briefly explain why each item matters
   (e.g. older HVAC → more frequent filter changes).
4. Show me the proposed plan and clearly mark which items are **new** vs. already tracked.
   After I confirm, create the new ones with `dib_create_task` (sensible titles and due
   dates). Do not recreate tasks that already exist.

If `tasks:write` isn't available, build the plan anyway and tell me I'll need a key with
`tasks:write` to have you create the tasks automatically. Explain any failure in plain
language.
