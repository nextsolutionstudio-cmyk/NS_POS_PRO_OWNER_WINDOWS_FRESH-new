NS POS PRO Developer Owner Windows FIX

1. Windows Delete Permanently now uses an in-app typed-confirmation modal instead of JavaScript prompt() (Electron compatibility).
2. Opening splash displays the selected artwork. Click Developer Owner Access to show the original secure cloud login.
3. Android source is included unchanged.
4. Cloudflare backend, saved customer data and login API were not altered.
5. Source ZIP only. Build Windows EXE with GitHub Actions workflow in owner_windows/.github/workflows/.
6. Test on a verified TEST account after taking a Cloudflare D1 backup; no live deletion has been performed.
7. Other prompt()-based functions are not included in this targeted fix.
