/* NS POS PRO Job Profiles v1 — business-scoped owner DRAFT editor.
   Base cloud role remains authoritative. These are additional visibility restrictions only.
   Changes are sent through revision-checked /v1/owner/control after Owner Publish.
*/
(()=>{'use strict';
const FEATS=["billing", "cashier", "history", "returns", "orders", "price_check", "products", "grn", "inventory", "wholesale", "delivery", "vehicle_stock", "customer_credit", "loyalty", "shops", "suppliers", "cheques", "rep_accounts", "shifts", "hr_payroll", "expenses", "accounts_profit", "reports", "documents", "printer_settings", "branding_settings"];
const BASE=['admin','cashier','rep','hr'];
const byId=id=>document.getElementById(id);
let roles=[],assignments={},staff=[],editing=null;
function str(x){return String(x||'').trim()}
function ids(){return new Set(roles.map(x=>x.id))}
function clear(){byId('nsJobName').value='';byId('nsJobBase').value='cashier';editing=null;document.querySelectorAll('[data-jobfeat]').forEach(x=>x.checked=true)}
function featureGrid(){const grid=byId('nsJobFeatureGrid');if(!grid)return;grid.replaceChildren();for(const f of FEATS){const label=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.dataset.jobfeat=f;cb.checked=true;const span=document.createElement('span');span.textContent=f.replaceAll('_',' ');label.append(cb,span);grid.append(label)}}
function message(x){byId('nsJobNotice').textContent=x}
function validRole(x){return x&&/^[a-z][a-z0-9_-]{2,39}$/.test(x.id)&&str(x.name).length>=2&&str(x.name).length<=45&&BASE.includes(x.base_role)&&Array.isArray(x.modules)&&x.modules.every(m=>FEATS.includes(m))}
function pickUser(){const id=byId('nsJobStaff').value;return staff.find(x=>x.id===id)}
function render(){
 const root=byId('nsJobList');if(!root)return;root.replaceChildren();
 const options=byId('nsJobAssignment');const selected=options.value;options.replaceChildren(new Option('Default Cloud Role (no custom restrictions)',''));
 roles.forEach(r=>{
  const row=document.createElement('div');const summary=document.createElement('span');summary.textContent=r.name+' · '+r.base_role+' · '+r.modules.length+' modules';
  const edit=document.createElement('button');edit.type='button';edit.className='secondary';edit.textContent='Edit';edit.onclick=()=>{editing=r.id;byId('nsJobName').value=r.name;byId('nsJobBase').value=r.base_role;document.querySelectorAll('[data-jobfeat]').forEach(x=>x.checked=r.modules.includes(x.dataset.jobfeat));byId('nsJobName').focus()};
  const del=document.createElement('button');del.type='button';del.className='secondary';del.textContent='Remove';del.onclick=()=>{if(!confirm('Remove '+r.name+'? Linked staff return to their original cloud role after publish.'))return;roles=roles.filter(x=>x.id!==r.id);for(const [k,v] of Object.entries(assignments))if(v===r.id)delete assignments[k];render();message('Job title removed in draft. Publish POS Settings to apply.')};
  row.append(summary,edit,del);root.append(row);options.add(new Option(r.name+' ('+r.base_role+')',r.id));
 });
 if(roles.some(r=>r.id===selected))options.value=selected;
 if(!roles.length)root.textContent='No custom job titles yet. Add Supervisor, Storekeeper, Driver or any business job.';
}
function saveDraft(){
 const name=str(byId('nsJobName').value),base=byId('nsJobBase').value,modules=[...document.querySelectorAll('[data-jobfeat]:checked')].map(x=>x.dataset.jobfeat);
 if(name.length<2||name.length>45||!BASE.includes(base)||!modules.length){message('Enter a title (2–45 characters), select a base role and one or more modules.');return}
 if(roles.length>=24&&!editing){message('Maximum 24 custom job titles per business.');return}
 const id=editing||('job_'+crypto.getRandomValues(new Uint32Array(1))[0].toString(36));
 const role={id,name,base_role:base,modules};if(!validRole(role))return message('Invalid job details');
 roles=roles.filter(x=>x.id!==id);roles.push(role);editing=null;clear();render();message('Saved as a draft. Use Publish POS Settings to save to Cloud.');
}
async function loadStaff(){
 const status=byId('nsJobStaffStatus');status.textContent='Loading…';
 try{
 const code=byId('controlBusiness').value;if(!code||code!==loadedControlBusiness)throw Error('Choose and Load business first.');
 const r=await request('/v1/owner/user-list?businessCode='+encodeURIComponent(code));
 staff=(r.users||[]).filter(u=>u.active!==0&&BASE.includes(u.role)&&typeof u.id==='string');
 // HR logins are included when the deployed Worker implements the updated tenant-scoped user list.
 const sel=byId('nsJobStaff');sel.replaceChildren(new Option('Choose verified staff',''));
 staff.forEach(u=>sel.add(new Option((u.username||u.email||u.id)+' · '+u.role,u.id)));
 status.textContent=staff.length+' cloud accounts loaded';
 }catch(e){status.textContent='Error: '+String(e.message||e).slice(0,100)}
}
function assign(){const u=pickUser(),rid=byId('nsJobAssignment').value;if(!u)return message('Load and select a Cloud staff account first.');
 const r=roles.find(r=>r.id===rid);
 if(r&&r.base_role!==u.role)return message('Job base role must match the verified staff login type ('+u.role+').');
 if(r)assignments[u.id]=rid;else delete assignments[u.id];message('Draft assignment saved for '+(u.username||u.email||u.id)+'. Publish POS Settings to apply.');
}
function toCloud(){return {job_roles:roles.map(r=>({id:r.id,name:r.name,base_role:r.base_role,modules:r.modules.slice()})),user_role_assignments:{...assignments}}}
function fromCloud(x){roles=Array.isArray(x?.job_roles)?x.job_roles.filter(validRole).slice(0,24).map(r=>({...r,modules:[...new Set(r.modules)]})):[];
 const legal=ids();assignments={};for(const [uid,rid] of Object.entries(x?.user_role_assignments||{}))if(/^[a-zA-Z0-9_-]{8,90}$/.test(uid)&&legal.has(rid))assignments[uid]=rid;
 staff=[];byId('nsJobStaff').replaceChildren(new Option('Load cloud staff first',''));clear();render();message('Loaded '+roles.length+' custom job titles.');}
function init(){featureGrid();clear();render();byId('nsJobSave').onclick=saveDraft;byId('nsJobReset').onclick=clear;byId('nsJobLoadStaff').onclick=loadStaff;byId('nsJobAssign').onclick=assign;
 const origFrom=controlFromFields,origTo=controlToFields;
 controlFromFields=function(){return {...origFrom(),...toCloud()}};
 controlToFields=function(c){origTo(c);fromCloud(c)};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();