 'use strict';
const {app,BrowserWindow,protocol,net,shell,ipcMain,dialog}=require('electron');
const {resolve,sep,join}=require('node:path');const {pathToFileURL}=require('node:url');const fs=require('node:fs');
const root=resolve(__dirname,'..','app');let win;
protocol.registerSchemesAsPrivileged([{scheme:'nsowner',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
function appPage(sender){return !!win&&sender===win.webContents&&sender.getURL().startsWith('nsowner://app/index.html')}
function safeExternal(raw){try{const u=new URL(raw);return u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password&&(!u.port||u.port==='443')&&!/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/i.test(u.hostname)?u.href:''}catch{return ''}}
app.whenReady().then(()=>{
 protocol.handle('nsowner',req=>{const u=new URL(req.url);if(u.hostname!=='app')return new Response('Denied',{status:403});const p=decodeURIComponent(u.pathname).replace(/^\/+/, '');if(!p||p.includes('\\'))return new Response('Denied',{status:403});const target=resolve(root,p);if(!target.startsWith(root+sep))return new Response('Denied',{status:403});return net.fetch(pathToFileURL(target).href)});
 win=new BrowserWindow({width:1250,height:850,minWidth:750,minHeight:590,title:'NS POS PRO Developer Owner',autoHideMenuBar:true,webPreferences:{preload:join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
 win.webContents.on('will-navigate',(e,url)=>{if(url!=='nsowner://app/index.html')e.preventDefault()});
 win.webContents.setWindowOpenHandler(({url})=>{const checked=safeExternal(url);if(checked)void shell.openExternal(checked);return {action:'deny'}});
 ipcMain.handle('owner:save-json',async(e,content)=>{
  if(!appPage(e.sender))throw Error('Invalid page');if(typeof content!=='string'||content.length>2000000)throw Error('Invalid export');let record;try{record=JSON.parse(content)}catch{throw Error('Not JSON')};if(!record||typeof record!=='object'||!record.exported_at)throw Error('Invalid payments export');
  const chosen=await dialog.showSaveDialog(win,{title:'Save Owner Payment Export',defaultPath:'NS_Owner_Payments.json',filters:[{name:'JSON',extensions:['json']} ]});if(chosen.canceled||!chosen.filePath)return {saved:false};fs.writeFileSync(chosen.filePath,content,'utf8');return {saved:true};
 });
 win.loadURL('nsowner://app/index.html');
});
app.on('window-all-closed',()=>app.quit());
