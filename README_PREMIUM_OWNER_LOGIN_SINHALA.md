# NS POS PRO Developer Owner - Premium password-first login (2026-11-02)

## Added
- Premium two-panel first opening screen on Windows, responsive phone version on Android.
- Uses existing NS POS PRO Customer Desktop welcome image.
- Owner email stored locally ONLY after first successful Owner login.
- Subsequent login shows remembered owner account and PASSWORD input only.
- Change button allows entering another owner email.
- Password is never saved. Session token stays in sessionStorage, as before.
- Cloudflare /v1/owner/login endpoint and all Owner Dashboard features are unchanged.
- Server API URL available under Server settings (pre-filled with the existing configured endpoint).

## Windows
Upload extracted contents of Windows ZIP to the Owner Windows GitHub repo; run Actions -> Build NS POS PRO Owner Windows EXE. This ZIP contains SOURCE; it is not an EXE.

## Android
Upload extracted contents of Android ZIP to the Owner Android GitHub repo; run Actions -> Build Owner APK. This ZIP contains SOURCE; it is not an APK. Update the installed app with same signing identity to retain its stored Owner email and app data. Do not uninstall the live app to upgrade unless its data is backed up.

## Security
Remembered email is stored in the app's local storage, not encrypted. Use only on trusted personal devices. It may be lost if app data is cleared. No passwords embedded. Cloud server and D1 DB are untouched.

## Check
1. First open: enter Owner Email + Password.
2. After successful login, Log out; remembered email and Password-only form appears.
3. Close/reopen: email remembered in app storage; type Password to login.
4. Change -> enter another Owner email manually.
5. Wrong Password -> sign-in denied; app stays logged out.

> Files have been statically patched; sign-in to your live Cloudflare deployment and builds have not been performed here.
