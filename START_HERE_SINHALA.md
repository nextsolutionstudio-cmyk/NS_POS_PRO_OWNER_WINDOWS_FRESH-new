# NS POS PRO Developer Owner Windows — GitHub Ready Source

මෙම ZIP එකේ Owner Windows Electron source එකත් `.github/workflows/build-windows-exe.yml` file එකත් ඇත.

1. GitHub එකේ **Owner Windows EXE සඳහා වෙනම Repository එකක්** තෝරන්න.
2. ZIP extract කරලා ඇතුළේ තියෙන `package.json`, `desktop`, `app`, `.github` folders repository root එකට upload කරන්න.
3. GitHub Actions → Build NS POS PRO Owner Windows EXE → Run workflow.
4. Build succeed නම් Artifacts → `NS-POS-PRO-Owner-Windows-EXE` Download කරන්න.

**Cloudflare Patch Review repo එකේ YAML එක පමණක් තැබීමෙන් EXE build වෙන්නේ නැහැ.** Electron files ද අවශ්‍යයි.

Workflow එක GitHub release publish නොකර `--publish never` භාවිත කරන නිසා GH_TOKEN අවශ්‍ය නැහැ. Windows native build තවම සැබෑ GitHub repo එකක verify කර නැහැ.

Customer Payments Delete / Block / Global Festival live Cloud APIs මේ ZIP එකෙන් deploy වෙන්නේ නැහැ; live Cloudflare backend එකට වෙනම integration/verification අවශ්‍යයි.
