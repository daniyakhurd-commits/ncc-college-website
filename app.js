const STORAGE_KEY = 'nccCollegeWebsiteData_v1';
const initialData = {
  cadets: [],
  achievements: [
    { id: 'welcome', title: 'NCC इकाई की शुरुआत', date: 'महाविद्यालय', description: 'महाविद्यालय की NCC इकाई से जुड़ी उपलब्धियाँ और गतिविधियाँ यहाँ प्रकाशित होंगी।', photo: '' }
  ],
  notices: [
    { id: 'welcome-notice', title: 'NCC सूचना पटल में आपका स्वागत है', date: '', description: 'नई घोषणाएँ और कार्यक्रम एडमिन पैनल से जोड़े जा सकते हैं।' }
  ],
  ranks: []
};
let data = loadData();
function loadData(){try{return {...initialData,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return structuredClone(initialData)}}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));renderAll();toast('बदलाव इस ब्राउज़र में सेव हो गए।')}
function esc(value=''){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function initials(name=''){return esc(name.trim().split(/\s+/).slice(0,2).map(part=>part[0]||'').join(''))}
function showPage(name){document.querySelectorAll('.page').forEach(page=>page.classList.toggle('active',page.id===`page-${name}`));document.querySelectorAll('.nav-link').forEach(link=>link.classList.toggle('active',link.dataset.page===name));document.querySelector('#main-nav').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>showPage(button.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(button=>button.addEventListener('click',()=>showPage(button.dataset.goto)));
document.querySelector('#menu-toggle').addEventListener('click',()=>document.querySelector('#main-nav').classList.toggle('open'));
document.querySelector('#current-year').textContent=new Date().getFullYear();
function renderCadets(){
 const query=document.querySelector('#cadet-search').value.trim().toLowerCase(),filter=document.querySelector('#cadet-filter').value;
 const ranks=[...new Set(data.cadets.map(c=>c.rank).filter(Boolean))];document.querySelector('#cadet-filter').innerHTML='<option value="all">सभी रैंक</option>'+ranks.map(rank=>`<option value="${esc(rank)}">${esc(rank)}</option>`).join('');document.querySelector('#cadet-filter').value=ranks.includes(filter)?filter:'all';
 const matching=data.cadets.filter(c=>(`${c.name} ${c.rank} ${c.year} ${c.type}`.toLowerCase().includes(query))&&(filter==='all'||c.rank===filter));
 document.querySelector('#cadet-grid').innerHTML=matching.map(c=>`<article class="cadet-card"><div class="cadet-photo">${c.photo?`<img src="${esc(c.photo)}" alt="${esc(c.name)}" loading="lazy" onerror="this.remove()">`:`<span class="avatar-placeholder">${initials(c.name)}</span>`}<span class="cadet-type">${esc(c.type||'CADET')}</span></div><div class="cadet-info"><h3>${esc(c.name)}</h3><div class="cadet-rank">${esc(c.rank)}</div><div class="cadet-meta"><span>${esc(c.year||'बैच उपलब्ध नहीं')}</span><span>कैडेट</span></div></div></article>`).join('');document.querySelector('#cadet-empty').hidden=matching.length>0;
}
function renderAchievements(){document.querySelector('#achievement-grid').innerHTML=data.achievements.map(a=>`<article class="achievement-card"><div class="achievement-visual">${a.photo?`<img src="${esc(a.photo)}" alt="${esc(a.title)}" loading="lazy">`:'✦'}</div><div class="achievement-copy"><small>${esc(a.date||'उपलब्धि')}</small><h3>${esc(a.title)}</h3><p>${esc(a.description||'')}</p></div></article>`).join('');document.querySelector('#achievement-empty').hidden=data.achievements.length>0}
function renderNotices(){document.querySelector('#notice-list').innerHTML=[...data.notices].reverse().map(n=>`<article class="notice-card"><div class="notice-icon">✳</div><div><time>${esc(n.date||'NCC सूचना')}</time><h3>${esc(n.title)}</h3><p>${esc(n.description)}</p></div></article>`).join('');document.querySelector('#notice-empty').hidden=data.notices.length>0}
function renderHome(){document.querySelector('#stat-cadets').textContent=data.cadets.length;document.querySelector('#stat-achievements').textContent=data.achievements.length;document.querySelector('#stat-years').textContent=new Set(data.cadets.map(c=>c.year).filter(Boolean)).size||'—';const items=[...data.notices.slice(-2).map(n=>({...n,tag:'सूचना'})),...data.achievements.slice(-1).map(a=>({...a,tag:'उपलब्धि'}))].slice(-3);document.querySelector('#home-highlights').innerHTML=items.map(x=>`<article class="feature-card"><span class="feature-date">${esc(x.date||'NCC')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p><span class="feature-tag">${x.tag}</span></article>`).join('');const groups={};data.cadets.forEach(c=>{if(c.year&&(c.rank.toLowerCase().includes('senior')||c.rank.toLowerCase().includes('under officer')||c.rank.toLowerCase().includes('suo')||c.rank.toLowerCase().includes('u.o')))groups[c.year] ||= c});const ranks=Object.entries(groups).slice(0,4);document.querySelector('#home-ranks').innerHTML=ranks.length?ranks.map(([year,c])=>`<div class="rank-item"><span class="rank-year">${esc(year)}</span><span class="rank-name">${esc(c.name)}</span><span class="rank-badge">${esc(c.rank)}</span></div>`).join(''):'<div class="rank-item"><span class="rank-year">वर्ष</span><span class="rank-name">वरिष्ठ रैंक की जानकारी कैडेट प्रोफाइल में जोड़ें</span><span class="rank-badge">NCC</span></div>'}
function renderAdminList(type){const list=document.querySelector(`#admin-${type}-list`);const items=data[type];list.innerHTML=items.map(item=>`<div class="admin-row"><div><strong>${esc(item.name||item.title)}</strong><small>${esc(item.rank||item.date||'')}</small></div><div class="admin-actions"><button class="mini-button" data-edit="${type}" data-id="${esc(item.id)}">संपादित</button><button class="mini-button delete" data-delete="${type}" data-id="${esc(item.id)}">हटाएँ</button></div></div>`).join('')||'<div class="empty-state">अभी कोई रिकॉर्ड नहीं है।</div>'}
function renderAll(){renderCadets();renderAchievements();renderNotices();renderHome();['cadets','achievements','notices'].forEach(renderAdminList)}
document.querySelector('#cadet-search').addEventListener('input',renderCadets);document.querySelector('#cadet-filter').addEventListener('change',renderCadets);
document.querySelectorAll('[data-admin-tab]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.admin-tab').forEach(tab=>tab.classList.toggle('active',tab===button));document.querySelectorAll('.admin-panel').forEach(panel=>panel.classList.toggle('active',panel.id===`admin-${button.dataset.adminTab}`))}));
const forms={cadets:'cadet-form',achievements:'achievement-form',notices:'notice-form'};
function openForm(type,item={}){const form=document.querySelector(`#${forms[type]}`);form.hidden=false;form.reset();form.elements.id.value=item.id||'';Object.keys(item).forEach(key=>{if(form.elements[key])form.elements[key].value=item[key]||''});document.querySelector(`#${type==='cadets'?'cadet':type==='achievements'?'achievement':'notice'}-form-title`).textContent=item.id?(type==='cadets'?'कैडेट संपादित करें':type==='achievements'?'उपलब्धि संपादित करें':'सूचना संपादित करें'):(type==='cadets'?'कैडेट जोड़ें':type==='achievements'?'उपलब्धि जोड़ें':'सूचना जोड़ें');form.scrollIntoView({behavior:'smooth',block:'center'})}
document.querySelector('#add-cadet').addEventListener('click',()=>openForm('cadets'));
document.querySelector('#add-achievement').addEventListener('click',()=>openForm('achievements'));
document.querySelector('#add-notice').addEventListener('click',()=>openForm('notices'));
document.querySelectorAll('[data-cancel]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`#${button.dataset.cancel}`).hidden=true));
Object.entries(forms).forEach(([type,id])=>document.querySelector(`#${id}`).addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,item=Object.fromEntries(new FormData(form).entries());item.id=item.id||`${type}-${Date.now()}`;if(type==='cadets'&&item.phone){}const index=data[type].findIndex(row=>row.id===item.id);if(index>=0)data[type][index]=item;else data[type].push(item);form.hidden=true;saveData()}));
document.addEventListener('click',event=>{const edit=event.target.closest('[data-edit]'),remove=event.target.closest('[data-delete]');if(edit){const type=edit.dataset.edit,item=data[type].find(row=>row.id===edit.dataset.id);openForm(type,item)}if(remove){const type=remove.dataset.delete;if(confirm('क्या आप इस रिकॉर्ड को हटाना चाहते हैं?')){data[type]=data[type].filter(row=>row.id!==remove.dataset.id);saveData()}}});
renderAll();
