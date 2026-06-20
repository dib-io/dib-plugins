---
description: A quick snapshot of your Dib home — profile, inventory highlights, and open tasks.
---

Give me a concise snapshot of my home using the Dib tools. This is read-only — don't create
or change anything.

1. Call `dib_get_property` for my home profile (type, size, key systems and their ages).
2. Call `dib_list_rooms` and `dib_list_inventory` to summarize what I have: total item
   count, a few notable/high-value items, and roughly how things are distributed across
   rooms. Don't paginate the entire inventory if it's large — a representative summary is
   fine.
3. Call `dib_list_tasks` and surface anything open or upcoming, especially overdue items.

Then present a short, friendly summary in three sections — **Home**, **Inventory**,
**Tasks** — and end with 2–3 suggested next actions I could ask for (e.g. an inventory
audit, a maintenance plan).

If any tool is unavailable, note which scope is missing and continue with what you can read.
Don't show raw error codes.
