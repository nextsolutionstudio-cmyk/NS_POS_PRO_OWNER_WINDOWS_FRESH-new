# NS POS PRO Developer Owner Android - GitHub APK Build Fix

## Why Actions says `Get started with GitHub Actions`
The earlier ZIP had the workflow inside `Owner/.github/workflows/`. GitHub only discovers workflows at the REPOSITORY ROOT: `.github/workflows/`.

## Easiest way (existing repository)
1. Open your GitHub Owner Android repo; choose `Code` -> `Add file` -> `Create new file`.
2. For new file name, type **`.github/workflows/build-owner-apk.yml`** (GitHub creates directories).
3. Paste the entire contents of `build-owner-apk-GITHUB-FIX.yml`.
4. Click `Commit changes` (on `main`).
5. Open `Actions` -> `NS POS PRO - Build Owner Android APK` -> `Run workflow`.
6. After green check, open the run -> scroll to `Artifacts` -> download `NS_POS_PRO_Developer_Owner_Debug_APK` -> extract ZIP -> install debug APK.

This fixed workflow finds Android project at repo root, `NS_Developer_Owner/`, `Owner/NS_Developer_Owner/`, or inside your uploaded original Owner Android ZIP. It DOES NOT create source code when only workflow exists; source ZIP/files must be uploaded too.

## Alternative: clean repository
Extract `NS_POS_PRO_Owner_Android_GITHUB_READY_SOURCE.zip`; upload its **contents**, not the outer zip as a lone file, to a new or clean GitHub repository. Confirm Code tab contains `app`, `.github`, `build.gradle`, `settings.gradle`. The same workflow then builds from project root. Avoid adding a second outer `Owner/` folder.

### Safety
This builds an UN-SIGNED-FOR-PRODUCTION **debug** APK. It may not upgrade an installed APK signed with a different signing key. Back up existing app and cloud data first. Do NOT uninstall production app until backup and signing are verified. Cloudflare Worker/backend is NOT deployed or repaired by building APK. Customer block and Payment Delete need their server routes active. This source has not been compiled into APK in this workspace.
