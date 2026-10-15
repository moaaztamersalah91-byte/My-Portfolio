Taste House appearance fix

Only the explicit theme button changes th_appearance. The preference is restored synchronously before the deferred customer application loads. Other page controls do not toggle appearance. Cross-tab changes synchronize. Existing dashboard files and image assets are unchanged.

Test manually: toggle light/dark, click navigation/cart/favorites, refresh, switch languages, and open a new tab. Note: browser-based E2E tests were not executed.
