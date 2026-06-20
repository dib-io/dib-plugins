---
description: Audit your Dib inventory for missing rooms, receipts, serial numbers, or values.
---

Audit my Dib inventory for data gaps. This is read-only unless I ask you to fix something.

1. Call `dib_list_inventory` and page through it fully — completeness matters for an audit.
   Use `dib_list_rooms` to resolve room references.
2. For each item, flag anything missing:
   - No assigned **room**
   - No linked **receipt or warranty document**
   - No **serial number**
   - No **estimated value**
   - A **warranty/purchase date** that looks expired or implausible
3. Present the findings as a tidy summary: total items, count of items with each kind of
   gap, and a short list of the most important items to fix first (prioritize high-value or
   high-risk items).
4. Offer to fix gaps. Only make changes after I confirm, and only with the write tools that
   are available (`dib_create_document` to attach a receipt, `dib_create_task` to chase
   down a missing detail, etc.). Read before every write to avoid duplicates.

If a needed tool/scope is unavailable, report the audit anyway and note what you'd need to
remediate automatically. Don't show raw error codes.
