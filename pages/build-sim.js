/**
 * pages/build-sim.js — Build Simulator
 * Mode Création Libre + Mode Simulation de Run pas-à-pas
 */
window.PAGE_BUILD_SIM = {
  mode: 'free',

  free: {
    classe: null, slots: [], reliques: [],
    tab: 'triggers', editSlot: null, editType: null,
  },

  run: {
    classe: null, faveurs: [], maledictions: [],
    salle: 0, maxSalles: 15, slots: [], reliques: [],
    inventaire: [], pv: 100, pvMax: 100,
    step: 'config', choix: [], historique: [],
  },

  RARETE_WEIGHTS: {
    1:  {Commun:80,Rare:18,'Épique':2,Légendaire:0},
    5:  {Commun:60,Rare:28,'Épique':10,Légendaire:2},
    8:  {Commun:45,Rare:33,'Épique':17,Légendaire:5},
    11: {Commun:30,Rare:35,'Épique':25,Légendaire:10},
    14: {Commun:20,Rare:30,'Épique':30,Légendaire:20},
  },

  rareteForSalle(salle) {
    const keys = [1,5,8,11,14];
    let w = this.RARETE_WEIGHTS[1];
    for (const k of keys) { if (salle >= k) w = this.RARETE_WEIGHTS[k]; }
    const r = Math.random() * 100;
    let acc = 0;
    for (const [rar, pct] of Object.entries(w)) {
      acc += pct;
      if (r < acc) return rar;
    }
    return 'Commun';
  },

  pickRandom(pool, salle, n) {
    const out = [], used = new Set();
    let tries = 0;
    while (out.length < n && tries++ < 400) {
      const targetRar = this.rareteForSalle(salle);
      const bucket = pool.filter(x => {
        const r = x.r || x.rarete || '';
        return r === targetRar && !used.has(x.id);
      });
      if (!bucket.length) continue;
      const item = bucket[Math.floor(Math.random() * bucket.length)];
      used.add(item.id);
      out.push(item);
    }
    if (out.length < n) {
      const remaining = pool.filter(x => !used.has(x.id));
      const extra = remaining.sort(() => Math.random()-.5).slice(0, n - out.length);
      out.push(...extra);
    }
    return out;
  },

  render() {
    return `
<div class="page-enter" style="height:calc(100vh - var(--nav-h));display:flex;flex-direction:column;overflow:hidden;">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:var(--bg2);border-bottom:1px solid var(--gris2);flex-shrink:0;">
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="font-family:var(--font-display);font-size:13px;color:var(--or);letter-spacing:3px;">BUILD SIMULATOR</div>
      <div style="display:flex;gap:2px;">
        <button onclick="PAGE_BUILD_SIM.switchMode('free')" id="bs-mode-free" style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;background:transparent;border:1px solid var(--gris2);color:var(--txt2);padding:6px 14px;cursor:pointer;transition:all .15s;">🔧 Création Libre</button>
        <button onclick="PAGE_BUILD_SIM.switchMode('run')" id="bs-mode-run" style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;background:transparent;border:1px solid var(--gris2);color:var(--txt2);padding:6px 14px;cursor:pointer;transition:all .15s;">🎲 Simulation de Run</button>
      </div>
    </div>
    <div id="bs-topbar-actions" style="display:flex;gap:8px;align-items:center;"></div>
  </div>
  <div id="bs-content" style="flex:1;overflow:hidden;display:flex;flex-direction:column;"></div>
</div>`;
  },

  init() { this.switchMode('free'); },

  switchMode(mode) {
    this.mode = mode;
    ['free','run'].forEach(m => {
      const btn = document.getElementById(`bs-mode-${m}`);
      if (!btn) return;
      btn.style.color = m === mode ? 'var(--or)' : 'var(--txt2)';
      btn.style.borderColor = m === mode ? 'var(--or)' : 'var(--gris2)';
      btn.style.background = m === mode ? 'var(--or-dim)' : 'transparent';
    });
    if (mode === 'free') this.renderFree();
    else this.renderRunMode();
  },

  // ═══════════════════════════════════════════════
  // CRÉATION LIBRE
  // ═══════════════════════════════════════════════
  renderFree() {
    document.getElementById('bs-topbar-actions').innerHTML = `
      <select id="bs-class-sel" onchange="PAGE_BUILD_SIM.setClass(this.value)" style="background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:9px;padding:5px 10px;letter-spacing:1px;outline:none;cursor:pointer;">
        <option value="">Choisir une classe…</option>
        ${GD_CLASSES.map(c => `<option value="${c.id}">${c.emoji} ${c.nom} — ${c.archetype}</option>`).join('')}
      </select>
      <button onclick="PAGE_BUILD_SIM.resetFree()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:6px 12px;cursor:pointer;" onmouseover="this.style.borderColor='var(--rouge)';this.style.color='var(--rouge)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">Réinitialiser</button>
      <button onclick="PAGE_BUILD_SIM.exportCode()" style="background:var(--or);border:none;color:var(--bg);font-family:var(--font-display);font-size:9px;font-weight:700;letter-spacing:2px;padding:7px 16px;cursor:pointer;text-transform:uppercase;" onmouseover="this.style.background='var(--or2)'" onmouseout="this.style.background='var(--or)'">Exporter</button>`;

    document.getElementById('bs-content').innerHTML = `
      <div style="display:grid;grid-template-columns:280px 1fr 300px;flex:1;overflow:hidden;height:100%;">
        <div style="background:var(--bg2);border-right:1px solid var(--gris2);overflow-y:auto;padding:14px;">
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:10px;">SLOTS DU BUILD</div>
          <div id="bs-class-info" style="margin-bottom:14px;"></div>
          <div id="bs-slots" style="display:flex;flex-direction:column;gap:6px;"></div>
          <div style="margin-top:20px;">
            <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;padding-top:14px;border-top:1px solid var(--gris2);">RELIQUES (<span id="bs-relic-count">0</span>)</div>
            <div id="bs-relics-active" style="display:flex;flex-direction:column;gap:4px;"></div>
            <button onclick="PAGE_BUILD_SIM.setTab('relics')" style="width:100%;margin-top:6px;background:transparent;border:1px dashed var(--gris2);color:var(--txt3);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:7px;cursor:pointer;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt3)'">+ Ajouter relique</button>
          </div>
          <div id="bs-synergies" style="margin-top:20px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;overflow:hidden;background:var(--bg);">
          <div style="display:flex;border-bottom:1px solid var(--gris2);background:var(--bg2);flex-shrink:0;">
            ${['triggers','effects','relics'].map(tab => `<button onclick="PAGE_BUILD_SIM.setTab('${tab}')" id="bs-tab-${tab}" style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;background:transparent;border:none;border-bottom:2px solid transparent;color:var(--txt2);padding:12px 20px;cursor:pointer;transition:all .15s;">${tab==='triggers'?'⚡ Déclencheurs':tab==='effects'?'💥 Effets':'💎 Reliques'}</button>`).join('')}
          </div>
          <div style="display:flex;gap:8px;padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--gris2);flex-shrink:0;flex-wrap:wrap;">
            <input id="bs-search" placeholder="Nom, tag…" oninput="PAGE_BUILD_SIM.renderCatalog()" style="background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:9px;padding:5px 10px;width:160px;outline:none;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
            <select id="bs-rar" onchange="PAGE_BUILD_SIM.renderCatalog()" style="background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:9px;padding:5px 10px;outline:none;cursor:pointer;">
              <option value="">Toutes raretés</option>
              ${['Commun','Rare','Épique','Légendaire'].map(r=>`<option>${r}</option>`).join('')}
            </select>
            <span id="bs-count" style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);align-self:center;"></span>
          </div>
          <div id="bs-catalog" style="overflow-y:auto;flex:1;padding:10px 14px;display:flex;flex-direction:column;gap:4px;"></div>
        </div>
        <div style="background:var(--bg2);border-left:1px solid var(--gris2);overflow-y:auto;padding:14px;">
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:12px;">STATISTIQUES</div>
          <div id="bs-stats" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;padding-top:14px;border-top:1px solid var(--gris2);">TAGS DU BUILD</div>
          <div id="bs-tags" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:20px;"></div>
          <div style="padding-top:14px;border-top:1px solid var(--gris2);">
            <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;">CODE BUILD</div>
            <div id="bs-code" style="background:var(--bg3);border:1px solid var(--gris2);padding:10px;font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;word-break:break-all;min-height:48px;line-height:1.8;">—</div>
            <button onclick="PAGE_BUILD_SIM.copyCode()" style="width:100%;margin-top:6px;background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:7px;cursor:pointer;transition:all .15s;text-transform:uppercase;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">📋 Copier le code</button>
          </div>
        </div>
      </div>`;
    this.setTab('triggers');
    this.renderSlots();
    this.renderStats();
  },

  setClass(id) {
    const cls = GD.findClass(id);
    this.free.classe = cls || null;
    this.free.slots = [];
    this.free.reliques = [];
    if (cls) {
      this.free.slots = [{trigger:null,effect:null,identity:true},{trigger:null,effect:null,identity:true}];
      for (let i=0;i<4;i++) this.free.slots.push({trigger:null,effect:null,identity:false});
    }
    this.renderSlots(); this.renderClassInfo(); this.renderStats(); this.renderCatalog();
  },

  renderClassInfo() {
    const el = document.getElementById('bs-class-info');
    if (!el) return;
    const cls = this.free.classe;
    if (!cls) { el.innerHTML=''; return; }
    el.innerHTML = `<div style="background:var(--bg3);border:1px solid var(--gris2);padding:12px;border-top:2px solid ${cls.color};">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:22px;">${cls.emoji}</span>
        <div>
          <div style="font-family:var(--font-display);font-size:.95rem;color:var(--creme);">${cls.nom}</div>
          <div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);letter-spacing:1px;">${cls.archetype}</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;">${cls.tags.map(t=>`<span style="font-family:var(--font-mono);font-size:7px;color:${cls.color};border:1px solid ${cls.color};padding:1px 5px;opacity:.8;">${t}</span>`).join('')}</div>
    </div>`;
  },

  renderSlots() {
    const el = document.getElementById('bs-slots');
    if (!el) return;
    if (!this.free.classe) {
      el.innerHTML=`<div style="font-family:var(--font-mono);font-size:9px;color:var(--txt3);letter-spacing:1px;padding:20px;text-align:center;border:1px dashed var(--gris3);">Choisissez une classe pour commencer</div>`;
      return;
    }
    el.innerHTML = this.free.slots.map((slot,i)=>{
      const isId=slot.identity, color=isId?'var(--violet)':'var(--gris2)';
      return `<div style="background:var(--bg3);border:1px solid ${color};padding:10px;">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:2px;color:${isId?'var(--violet)':'var(--txt3)'};margin-bottom:6px;">${isId?'◆ IDENTITAIRE':`SLOT ${i-1}`}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
          <div onclick="PAGE_BUILD_SIM.openPick(${i},'trigger')" style="background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;cursor:pointer;transition:border-color .15s;min-height:36px;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris3)'">${slot.trigger?`<div style="font-family:var(--font-mono);font-size:7px;color:var(--or);">⚡ ${slot.trigger.nom}</div>`:`<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);">+ Déclencheur</div>`}</div>
          <div onclick="PAGE_BUILD_SIM.openPick(${i},'effect')" style="background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;cursor:pointer;transition:border-color .15s;min-height:36px;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris3)'">${slot.effect?`<div style="font-family:var(--font-mono);font-size:7px;color:var(--ocre);">💥 ${slot.effect.nom}</div>`:`<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);">+ Effet</div>`}</div>
        </div>
        ${(slot.trigger||slot.effect)?`<button onclick="PAGE_BUILD_SIM.clearSlot(${i})" style="width:100%;margin-top:4px;background:transparent;border:1px solid var(--gris3);color:var(--txt3);font-family:var(--font-mono);font-size:7px;padding:3px;cursor:pointer;letter-spacing:1px;transition:all .15s;" onmouseover="this.style.color='var(--rouge)';this.style.borderColor='var(--rouge)'" onmouseout="this.style.color='var(--txt3)';this.style.borderColor='var(--gris3)'">✕ Vider</button>`:''}
      </div>`;
    }).join('');
    this.renderRelicsActive(); this.renderSynergies();
  },

  openPick(slotIdx,type) { this.free.editSlot=slotIdx; this.free.editType=type; this.setTab(type==='trigger'?'triggers':'effects'); },

  setTab(tab) {
    this.free.tab=tab;
    ['triggers','effects','relics'].forEach(t=>{
      const btn=document.getElementById(`bs-tab-${t}`);
      if(!btn)return;
      btn.style.color=t===tab?'var(--or)':'var(--txt2)';
      btn.style.borderBottomColor=t===tab?'var(--or)':'transparent';
    });
    this.renderCatalog();
  },

  renderCatalog() {
    const el=document.getElementById('bs-catalog'), cnt=document.getElementById('bs-count');
    if(!el)return;
    const search=(document.getElementById('bs-search')?.value||'').toLowerCase();
    const rar=document.getElementById('bs-rar')?.value||'';
    const tab=this.free.tab;
    let items=[];
    if(tab==='triggers') items=GD_TRIGGERS.filter(t=>(!search||t.nom.toLowerCase().includes(search)||(t.tags||[]).join(' ').includes(search)||(t.cond||'').toLowerCase().includes(search))&&(!rar||t.rarete===rar));
    else if(tab==='effects') items=GD_EFFECTS.filter(e=>(!search||e.nom.toLowerCase().includes(search)||(e.tags||[]).join(' ').includes(search)||(e.desc||'').toLowerCase().includes(search))&&(!rar||e.r===rar));
    else items=GD_RELICS.filter(r=>(!search||r.nom.toLowerCase().includes(search)||(r.tags||[]).join(' ').includes(search))&&(!rar||r.rarete===rar));
    if(cnt)cnt.textContent=`${items.length} résultats`;
    el.innerHTML=items.map(item=>{
      const isT=tab==='triggers',isR=tab==='relics';
      const color=isT?'var(--or)':isR?'var(--violet)':'var(--ocre)';
      const rarete=isT?item.rarete:isR?item.rarete:item.r;
      const desc=item.desc||item.effet||item.cond||'';
      return `<div onclick="PAGE_BUILD_SIM.pick('${item.id}')" style="background:var(--bg2);border:1px solid var(--gris2);padding:10px 12px;cursor:pointer;transition:border-color .15s;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
          <span style="font-family:var(--font-display);font-size:.82rem;color:${color};letter-spacing:.5px;">${item.nom}</span>
          <span style="font-family:var(--font-mono);font-size:7px;color:${GD.rarityColor(rarete)};">${rarete}</span>
        </div>
        <div style="font-size:.8rem;color:var(--txt2);margin-bottom:6px;line-height:1.4;">${desc}</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">${(item.tags||[]).map(t=>`<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 4px;">${t}</span>`).join('')}</div>
      </div>`;
    }).join('');
  },

  pick(id) {
    const {editSlot,editType,tab}=this.free;
    if(tab==='relics'){
      const relic=GD_RELICS.find(r=>r.id===id);
      if(relic&&!this.free.reliques.find(r=>r.id===id)){
        this.free.reliques.push(relic);
        const cnt=document.getElementById('bs-relic-count');
        if(cnt)cnt.textContent=this.free.reliques.length;
        this.renderSlots(); this.renderStats();
      }
      return;
    }
    if(editSlot===null)return;
    const item=tab==='triggers'?GD_TRIGGERS.find(t=>t.id===id):GD_EFFECTS.find(e=>e.id===id);
    if(!item)return;
    if(editType==='trigger')this.free.slots[editSlot].trigger=item;
    else this.free.slots[editSlot].effect=item;
    this.free.editSlot=null;
    this.renderSlots(); this.renderStats(); this.generateCode();
  },

  clearSlot(i){this.free.slots[i].trigger=null;this.free.slots[i].effect=null;this.renderSlots();this.renderStats();this.generateCode();},

  renderRelicsActive(){
    const el=document.getElementById('bs-relics-active');
    if(!el)return;
    el.innerHTML=this.free.reliques.map((r,i)=>`<div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;"><span style="font-family:var(--font-mono);font-size:7px;color:var(--violet);">💎 ${r.nom}</span><button onclick="PAGE_BUILD_SIM.removeRelic(${i})" style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:9px;" onmouseover="this.style.color='var(--rouge)'" onmouseout="this.style.color='var(--txt3)'">✕</button></div>`).join('');
  },

  removeRelic(i){
    this.free.reliques.splice(i,1);
    const cnt=document.getElementById('bs-relic-count');
    if(cnt)cnt.textContent=this.free.reliques.length;
    this.renderSlots(); this.renderStats();
  },

  renderSynergies(){
    const el=document.getElementById('bs-synergies');
    if(!el)return;
    const buildTags=this.getBuildTags();
    const active=GD_SYNERGIES.filter(s=>s.tags.some(t=>buildTags.includes(t)));
    if(!active.length){el.innerHTML='';return;}
    el.innerHTML=`<div style="padding-top:14px;border-top:1px solid var(--gris2);"><div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;">SYNERGIES DÉTECTÉES</div>${active.map(s=>`<div style="background:var(--bg4);border:1px solid var(--vert);padding:8px 10px;margin-bottom:4px;border-left:2px solid var(--vert);"><div style="font-family:var(--font-display);font-size:.8rem;color:var(--vert);margin-bottom:4px;">${s.nom}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);">◆ ${s.palier1}</div></div>`).join('')}</div>`;
  },

  getBuildTags(){
    const tags=new Set();
    this.free.slots.forEach(s=>{(s.trigger?.tags||[]).forEach(t=>tags.add(t));(s.effect?.tags||[]).forEach(t=>tags.add(t));});
    this.free.reliques.forEach(r=>(r.tags||[]).forEach(t=>tags.add(t)));
    if(this.free.classe)this.free.classe.tags.forEach(t=>tags.add(t));
    return [...tags];
  },

  renderStats(){
    const el=document.getElementById('bs-stats'),tagsEl=document.getElementById('bs-tags');
    if(!el)return;
    const filled=this.free.slots.filter(s=>s.trigger&&s.effect).length;
    const total=this.free.slots.length, tags=this.getBuildTags();
    el.innerHTML=[['Slots remplis',`${filled} / ${total}`],['Reliques',`${this.free.reliques.length}`],['Tags uniques',`${tags.length}`],['Synergies',`${GD_SYNERGIES.filter(s=>s.tags.some(t=>tags.includes(t))).length}`]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--gris3);"><span style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;">${l}</span><span style="font-family:var(--font-display);font-size:.9rem;color:var(--or);">${v}</span></div>`).join('');
    if(tagsEl)tagsEl.innerHTML=tags.map(t=>`<span style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);border:1px solid var(--gris3);padding:2px 6px;">${t}</span>`).join('');
    this.generateCode();
  },

  generateCode(){
    const el=document.getElementById('bs-code');
    if(!el)return;
    if(!this.free.classe){el.textContent='—';return;}
    const parts=[this.free.classe.id.substring(0,3).toUpperCase(),...this.free.slots.map(s=>`${s.trigger?.id?.substring(3,6)||'000'}-${s.effect?.id?.substring(3,6)||'000'}`),...this.free.reliques.map(r=>r.id)];
    try{const code=btoa(unescape(encodeURIComponent(parts.join('|')))).replace(/=/g,'').substring(0,24).toUpperCase();el.textContent=`DK-${code}`;}catch(e){el.textContent='DK-ERROR';}
  },

  copyCode(){
    const code=document.getElementById('bs-code')?.textContent||'—';
    navigator.clipboard?.writeText(code).then(()=>{const btn=event.target;btn.textContent='✅ Copié !';setTimeout(()=>btn.textContent='📋 Copier le code',2000);});
  },

  exportCode(){
    const build={classe:this.free.classe?.id,slots:this.free.slots.map(s=>({trigger:s.trigger?.id,effect:s.effect?.id})),reliques:this.free.reliques.map(r=>r.id)};
    const blob=new Blob([JSON.stringify(build,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`build_${this.free.classe?.id||'draft'}.json`;a.click();
  },

  resetFree(){
    this.free={classe:null,slots:[],reliques:[],tab:'triggers',editSlot:null,editType:null};
    const sel=document.getElementById('bs-class-sel');if(sel)sel.value='';
    this.renderSlots();this.renderClassInfo();this.renderStats();this.renderCatalog();
  },

  // ═══════════════════════════════════════════════
  // SIMULATION DE RUN
  // ═══════════════════════════════════════════════
  renderRunMode(){
    document.getElementById('bs-topbar-actions').innerHTML=`
      <button onclick="PAGE_BUILD_SIM.resetRun()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:6px 12px;cursor:pointer;" onmouseover="this.style.borderColor='var(--rouge)';this.style.color='var(--rouge)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">↺ Reset</button>`;
    if(this.run.step==='config') this.renderRunConfig(document.getElementById('bs-content'));
    else this.renderRunGame(document.getElementById('bs-content'));
  },

  renderRunConfig(container){
    container.innerHTML=`
      <div style="overflow-y:auto;flex:1;padding:32px 60px;max-width:960px;margin:0 auto;width:100%;">
        <div style="font-family:var(--font-display);font-size:11px;color:var(--or);letter-spacing:3px;margin-bottom:4px;">SIMULATION DE RUN</div>
        <div style="font-size:1rem;color:var(--txt2);margin-bottom:32px;">Construction du build en conditions réelles — taux de rareté progressifs, marchand toutes les 5 salles, salle de repos aux salles 4, 9 et 13.</div>
        <div style="margin-bottom:28px;">
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:12px;">CLASSE</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">
            ${GD_CLASSES.map(c=>`<div id="run-cls-${c.id}" onclick="PAGE_BUILD_SIM.selectRunClass('${c.id}')" style="background:var(--bg2);border:1px solid var(--gris2);padding:12px;cursor:pointer;transition:all .15s;text-align:center;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="if(!this.classList.contains('sel'))this.style.borderColor='var(--gris2)'"><div style="font-size:24px;margin-bottom:4px;">${c.emoji}</div><div style="font-family:var(--font-display);font-size:.78rem;color:var(--creme);">${c.nom}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);margin-top:2px;">${c.archetype}</div></div>`).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--vert);margin-bottom:12px;">✨ FAVEURS (max 2)</div>
            <div id="run-fav-list" style="display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto;"></div>
            <div id="run-fav-cost" style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);margin-top:6px;">0 💀 sélectionnés</div>
          </div>
          <div>
            <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--rouge);margin-bottom:12px;">💀 MALÉDICTIONS</div>
            <div id="run-mal-list" style="display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto;"></div>
            <div id="run-mal-cost" style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);margin-top:6px;">0 💀 sélectionnées</div>
          </div>
        </div>
        <button onclick="PAGE_BUILD_SIM.startRun()" id="run-start-btn" style="background:var(--or);border:none;color:var(--bg);font-family:var(--font-display);font-size:11px;font-weight:700;letter-spacing:3px;padding:14px 40px;cursor:pointer;text-transform:uppercase;opacity:.4;pointer-events:none;" onmouseover="this.style.background='var(--or2)'" onmouseout="this.style.background='var(--or)'">▶ Lancer la Run</button>
      </div>`;
    this.renderRunFavMal();
  },

  selectRunClass(id){
    this.run.classe=GD.findClass(id);
    document.querySelectorAll('[id^="run-cls-"]').forEach(el=>{el.style.borderColor='var(--gris2)';el.style.background='var(--bg2)';el.classList.remove('sel');});
    const el=document.getElementById(`run-cls-${id}`);
    if(el){el.style.borderColor='var(--or)';el.style.background='var(--or-dim)';el.classList.add('sel');}
    const btn=document.getElementById('run-start-btn');
    if(btn){btn.style.opacity='1';btn.style.pointerEvents='auto';}
  },

  renderRunFavMal(){
    const GD_FAV=window.GD_FAVEURS||[], GD_MAL=window.GD_MALEDICTIONS||[];
    const favEl=document.getElementById('run-fav-list'), malEl=document.getElementById('run-mal-list');
    if(favEl) favEl.innerHTML=GD_FAV.slice(0,10).map(f=>`<div id="fav-${f.id}" onclick="PAGE_BUILD_SIM.toggleFav('${f.id}')" style="padding:7px 10px;background:var(--bg3);border:1px solid var(--gris2);cursor:pointer;border-left:2px solid var(--gris2);transition:all .15s;"><div style="font-family:var(--font-display);font-size:.8rem;color:var(--creme);">${f.nom}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);margin-top:2px;">${f.effet} · ${f.cout} 💀</div></div>`).join('')||`<div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);padding:8px;">Aucune faveur (ajoutez GD_FAVEURS dans gamedata.js)</div>`;
    if(malEl) malEl.innerHTML=GD_MAL.slice(0,10).map(m=>`<div id="mal-${m.id}" onclick="PAGE_BUILD_SIM.toggleMal('${m.id}')" style="padding:7px 10px;background:var(--bg3);border:1px solid var(--gris2);cursor:pointer;border-left:2px solid var(--gris2);transition:all .15s;"><div style="font-family:var(--font-display);font-size:.8rem;color:var(--creme);">${m.nom}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);margin-top:2px;">${(m.effet||'').substring(0,70)}… · ${m.cout} 💀</div></div>`).join('')||`<div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);padding:8px;">Aucune malédiction (ajoutez GD_MALEDICTIONS dans gamedata.js)</div>`;
  },

  toggleFav(id){
    const GD_FAV=window.GD_FAVEURS||[], f=GD_FAV.find(x=>x.id===id);if(!f)return;
    const idx=this.run.faveurs.findIndex(x=>x.id===id);
    if(idx>=0)this.run.faveurs.splice(idx,1);
    else if(this.run.faveurs.length<2)this.run.faveurs.push(f);
    document.querySelectorAll('[id^="fav-"]').forEach(el=>{const fid=el.id.replace('fav-','');const on=this.run.faveurs.some(x=>x.id===fid);el.style.borderLeftColor=on?'var(--vert)':'var(--gris2)';el.style.background=on?'rgba(74,124,89,.12)':'var(--bg3)';});
    const c=document.getElementById('run-fav-cost');if(c)c.textContent=`${this.run.faveurs.reduce((a,x)=>a+x.cout,0)} 💀 sélectionnés`;
  },

  toggleMal(id){
    const GD_MAL=window.GD_MALEDICTIONS||[], m=GD_MAL.find(x=>x.id===id);if(!m)return;
    const idx=this.run.maledictions.findIndex(x=>x.id===id);
    if(idx>=0)this.run.maledictions.splice(idx,1);else this.run.maledictions.push(m);
    document.querySelectorAll('[id^="mal-"]').forEach(el=>{const mid=el.id.replace('mal-','');const on=this.run.maledictions.some(x=>x.id===mid);el.style.borderLeftColor=on?'var(--rouge)':'var(--gris2)';el.style.background=on?'rgba(192,48,40,.12)':'var(--bg3)';});
    const c=document.getElementById('run-mal-cost');if(c)c.textContent=`${this.run.maledictions.reduce((a,x)=>a+x.cout,0)} 💀 sélectionnées`;
  },

  startRun(){
    if(!this.run.classe)return;
    this.run.salle=1; this.run.pv=100; this.run.pvMax=100;
    this.run.slots=[{trigger:null,effect:null,identity:true},{trigger:null,effect:null,identity:true}];
    for(let i=0;i<4;i++)this.run.slots.push({trigger:null,effect:null,identity:false});
    this.run.reliques=[]; this.run.inventaire=[]; this.run.historique=[];
    this.run.step='recompense'; this.run.choix=this.genChoix(this.run.salle);
    this.renderRunGame(document.getElementById('bs-content'));
  },

  genChoix(salle){
    const triggers=this.pickRandom(GD_TRIGGERS,salle,3);
    const effects=this.pickRandom(GD_EFFECTS,salle,3);
    return triggers.map((t,i)=>({trigger:t,effect:effects[i]||effects[0]}));
  },

  getSalleType(salle){
    if(salle===this.run.maxSalles)return'boss';
    if(salle%5===0)return'marchand';
    if([4,9,13].includes(salle))return'repos';
    return'normal';
  },

  pickChoix(idx){
    const choix=this.run.choix[idx];if(!choix)return;
    const slotIdx=this.run.slots.findIndex(s=>!s.trigger&&!s.effect&&!s.identity);
    if(slotIdx>=0){this.run.slots[slotIdx].trigger=choix.trigger;this.run.slots[slotIdx].effect=choix.effect;}
    else this.run.inventaire.push(choix);
    this.run.historique.push(`Salle ${this.run.salle} — ${choix.trigger.nom} + ${choix.effect.nom}`);
    this.advanceSalle();
  },

  skipChoix(){this.run.historique.push(`Salle ${this.run.salle} — Ignorée`);this.advanceSalle();},

  soinRepos(type){
    if(type==='soin')this.run.pv=Math.min(this.run.pvMax,this.run.pv+30);
    this.run.historique.push(`Repos (${this.run.salle}) — ${type}`);
    this.advanceSalle();
  },

  advanceSalle(){
    this.run.salle++;
    if(this.run.salle>this.run.maxSalles){this.run.step='fin';}
    else{
      const type=this.getSalleType(this.run.salle);
      if(type==='repos')this.run.step='repos';
      else if(type==='marchand')this.run.step='marchand';
      else{this.run.step='recompense';this.run.choix=this.genChoix(this.run.salle);}
    }
    this.renderRunGame(document.getElementById('bs-content'));
  },

  renderRunGame(container){
    const r=this.run, pvPct=Math.round(r.pv/r.pvMax*100);
    container.innerHTML=`
      <div style="display:grid;grid-template-columns:260px 1fr 240px;flex:1;overflow:hidden;height:100%;">
        <!-- Col gauche — Build -->
        <div style="background:var(--bg2);border-right:1px solid var(--gris2);overflow-y:auto;padding:14px;">
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;color:var(--or);margin-bottom:10px;">BUILD — ${r.slots.filter(s=>s.trigger&&s.effect).length} / ${r.slots.length} SLOTS</div>
          <div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:8px;color:var(--txt2);margin-bottom:4px;"><span>PV</span><span style="color:var(--creme);">${r.pv} / ${r.pvMax}</span></div><div style="height:6px;background:var(--gris3);border-radius:1px;overflow:hidden;"><div style="height:100%;width:${pvPct}%;background:linear-gradient(90deg,#8b0000,#cc2200);transition:width .3s;"></div></div></div>
          ${r.classe?`<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:8px;background:var(--bg3);border:1px solid var(--gris2);"><span style="font-size:20px;">${r.classe.emoji}</span><div><div style="font-family:var(--font-display);font-size:.85rem;color:var(--creme);">${r.classe.nom}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);">${r.classe.archetype}</div></div></div>`:''}
          ${r.slots.map((s,i)=>{const isId=s.identity;return`<div style="background:var(--bg3);border:1px solid ${isId?'var(--violet)':'var(--gris3)'};padding:7px 9px;margin-bottom:4px;"><div style="font-family:var(--font-mono);font-size:7px;color:${isId?'var(--violet)':'var(--txt3)'};margin-bottom:4px;">${isId?'◆ IDENTITAIRE':`SLOT ${i-1}`}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;"><div style="font-family:var(--font-mono);font-size:7px;color:${s.trigger?'var(--or)':'var(--txt3)'};">${s.trigger?`⚡ ${s.trigger.nom}`:'— vide'}</div><div style="font-family:var(--font-mono);font-size:7px;color:${s.effect?'var(--ocre)':'var(--txt3)'};">${s.effect?`💥 ${s.effect.nom}`:'— vide'}</div></div></div>`;}).join('')}
          ${r.reliques.length?`<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--gris2);"><div style="font-family:var(--font-mono);font-size:7px;letter-spacing:2px;color:var(--violet);margin-bottom:6px;">RELIQUES</div>${r.reliques.map(rel=>`<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);padding:4px 6px;background:var(--bg4);margin-bottom:3px;">💎 ${rel.nom}</div>`).join('')}</div>`:''}
        </div>
        <!-- Col centre — Étape -->
        <div style="overflow-y:auto;padding:24px 28px;background:var(--bg);">${this.renderRunStep()}</div>
        <!-- Col droite — Progression -->
        <div style="background:var(--bg2);border-left:1px solid var(--gris2);overflow-y:auto;padding:14px;">
          <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;color:var(--or);margin-bottom:10px;">PARCOURS</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:16px;">
            ${Array.from({length:r.maxSalles}).map((_,i)=>{const n=i+1,t=this.getSalleType(n),done=n<r.salle,cur=n===r.salle,icon=t==='repos'?'☕':t==='marchand'?'🪬':t==='boss'?'👑':'·';return`<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:${done||cur?'9px':'8px'};border-radius:2px;border:1px solid;font-family:var(--font-mono);border-color:${cur?'var(--or)':done?'var(--vert)':'var(--gris3)'};background:${cur?'rgba(200,149,42,.2)':done?'rgba(74,124,89,.2)':'transparent'};color:${cur?'var(--or)':done?'var(--vert)':'var(--txt3)'};">${icon}</div>`;}).join('')}
          </div>
          <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:1px;color:var(--txt3);margin-bottom:8px;text-transform:uppercase;">Historique</div>
          <div style="display:flex;flex-direction:column;gap:3px;">${r.historique.slice(-10).reverse().map(h=>`<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);padding:4px 6px;background:var(--bg3);line-height:1.4;">${h}</div>`).join('')||`<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);">Aucune action</div>`}</div>
        </div>
      </div>`;
  },

  renderRunStep(){
    const r=this.run;
    if(r.step==='fin')return`<div style="text-align:center;padding:40px 0;"><div style="font-size:48px;margin-bottom:16px;">👑</div><div style="font-family:var(--font-display);font-size:2rem;color:var(--or);letter-spacing:4px;margin-bottom:8px;">RUN TERMINÉE</div><div style="font-size:1rem;color:var(--txt2);margin-bottom:32px;">Salle ${r.maxSalles} / ${r.maxSalles} complétée</div><button onclick="PAGE_BUILD_SIM.resetRun()" style="background:var(--or);border:none;color:var(--bg);font-family:var(--font-display);font-size:10px;letter-spacing:2px;padding:12px 32px;cursor:pointer;">↺ Nouvelle Run</button></div>`;

    if(r.step==='repos')return`<div><div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:3px;margin-bottom:6px;">SALLE ${r.salle} / ${r.maxSalles}</div><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--or);margin-bottom:4px;">☕ Salle de Repos</div><div style="font-size:.9rem;color:var(--txt2);margin-bottom:24px;">Choisissez une option de récupération.</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">${[['💊','Soigner','+30 PV','soin'],['⬆️','Améliorer','Upgrade un effet','upgrade'],['🔀','Réorganiser','Réordonner les slots','reorg']].map(([icon,t,d,type])=>`<div onclick="PAGE_BUILD_SIM.soinRepos('${type}')" style="padding:20px;background:var(--bg2);border:1px solid var(--gris2);cursor:pointer;text-align:center;transition:border-color .15s;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'"><div style="font-size:28px;margin-bottom:8px;">${icon}</div><div style="font-family:var(--font-display);font-size:.82rem;color:var(--creme);margin-bottom:4px;">${t}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);">${d}</div></div>`).join('')}</div></div>`;

    if(r.step==='marchand'){
      const items=this.pickRandom([...GD_TRIGGERS,...GD_EFFECTS,...GD_RELICS],r.salle,6);
      return`<div><div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:3px;margin-bottom:6px;">SALLE ${r.salle} / ${r.maxSalles}</div><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--or);margin-bottom:4px;">🪬 Le Marchand</div><div style="font-size:.9rem;color:var(--txt2);margin-bottom:24px;">Ajoutez une pièce à votre build.</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">${items.map(item=>{const rarete=item.r||item.rarete||'Commun';const desc=(item.desc||item.effet||item.cond||'').substring(0,60);return`<div onclick="PAGE_BUILD_SIM.buyItem('${item.id}')" style="padding:12px;background:var(--bg2);border:1px solid var(--gris2);cursor:pointer;transition:border-color .15s;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'"><div style="font-family:var(--font-mono);font-size:7px;color:${GD.rarityColor(rarete)};margin-bottom:4px;">${rarete}</div><div style="font-family:var(--font-display);font-size:.8rem;color:var(--creme);margin-bottom:4px;">${item.nom}</div><div style="font-size:.75rem;color:var(--txt2);line-height:1.4;">${desc}…</div></div>`;}).join('')}</div><button onclick="PAGE_BUILD_SIM.skipChoix()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:8px 20px;cursor:pointer;">Quitter le marchand →</button></div>`;
    }

    return`<div><div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:3px;margin-bottom:6px;">SALLE ${r.salle} / ${r.maxSalles} · ${this.getSalleType(r.salle).toUpperCase()}</div><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--or);margin-bottom:4px;">⚔ Récompense</div><div style="font-size:.9rem;color:var(--txt2);margin-bottom:24px;">Choisissez une compétence à ajouter à votre build.</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">${r.choix.map((c,i)=>{const rarT=c.trigger.rarete,rarE=c.effect.r;return`<div onclick="PAGE_BUILD_SIM.pickChoix(${i})" style="background:var(--bg2);border:1px solid var(--gris2);overflow:hidden;cursor:pointer;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.transform='translateY(0)'"><div style="padding:10px 12px;border-bottom:1px solid var(--gris3);background:var(--bg3);"><div style="font-family:var(--font-mono);font-size:7px;color:${GD.rarityColor(rarT)};margin-bottom:4px;">⚡ ${rarT}</div><div style="font-family:var(--font-display);font-size:.85rem;color:var(--or);margin-bottom:3px;">${c.trigger.nom}</div><div style="font-size:.75rem;color:var(--txt2);line-height:1.4;">${(c.trigger.cond||'').substring(0,60)}</div><div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:5px;">${(c.trigger.tags||[]).slice(0,3).map(t=>`<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 3px;">${t}</span>`).join('')}</div></div><div style="padding:10px 12px;"><div style="font-family:var(--font-mono);font-size:7px;color:${GD.rarityColor(rarE)};margin-bottom:4px;">💥 ${rarE}</div><div style="font-family:var(--font-display);font-size:.85rem;color:var(--ocre);margin-bottom:3px;">${c.effect.nom}</div><div style="font-size:.75rem;color:var(--txt2);line-height:1.4;">${(c.effect.desc||'').substring(0,60)}</div><div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:5px;">${(c.effect.tags||[]).slice(0,3).map(t=>`<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 3px;">${t}</span>`).join('')}</div></div></div>`;}).join('')}</div><button onclick="PAGE_BUILD_SIM.skipChoix()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:1px;padding:8px 20px;cursor:pointer;" onmouseover="this.style.color='var(--txt)'" onmouseout="this.style.color='var(--txt2)'">Passer sans récompense →</button></div>`;
  },

  buyItem(id){
    const item=GD_TRIGGERS.find(t=>t.id===id)||GD_EFFECTS.find(e=>e.id===id)||GD_RELICS.find(r=>r.id===id);
    if(!item)return;
    if(GD_RELICS.some(r=>r.id===id)){this.run.reliques.push(item);this.run.historique.push(`Marchand — Relique : ${item.nom}`);}
    else{const slotIdx=this.run.slots.findIndex(s=>!s.trigger&&!s.effect&&!s.identity);if(slotIdx>=0)this.run.slots[slotIdx].trigger=item;this.run.historique.push(`Marchand — ${item.nom}`);}
    this.renderRunGame(document.getElementById('bs-content'));
  },

  resetRun(){
    this.run={classe:null,faveurs:[],maledictions:[],salle:0,maxSalles:15,slots:[],reliques:[],inventaire:[],pv:100,pvMax:100,step:'config',choix:[],historique:[]};
    this.renderRunMode();
  },
};
