---
name: Logística Monitor
description: Durable product constraints for the logistics monitoring dashboard.
---

The mandatory Python collector is a fixed user-supplied contract and must remain byte-for-byte unchanged. The web layer may mirror its public data collection, but must not silently add storm warnings that its temperature-only payload cannot support.

**Why:** The user's assignment requires the exact Python code and explicitly calls for storm warnings, while the supplied weather request only returns current temperature; showing an unconfirmed storm would create an unsafe operational signal.

**How to apply:** Preserve the Python file exactly when extending the app. If richer weather risk is needed later, add a separate endpoint or versioned collector with explicit user approval and fields such as precipitation or storm warning.