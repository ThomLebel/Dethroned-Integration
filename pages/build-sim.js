/**
 * pages/build-sim.js — Build Simulator
 * Lit GD_CLASSES, GD_EFFECTS, GD_TRIGGERS, GD_RELICS, GD_SYNERGIES depuis gamedata.js
 * Zéro duplication de données.
 */
window.PAGE_BUILD_SIM = {
  state: {
    classe: null,
    slots: [],          // Array de {trigger, effect}
    reliques: [],
    maxSlots: 6,
    filterTag: '',
    filterRarete: '',
    tab: 'triggers',    // 'triggers' | 'effects' | 'relics'
    editSlot: null,     // index du slot en cours d'édition
  },

  render() {
    return `
<div class="page-enter" style="height:calc(100vh - var(--nav-h));display:flex;flex-direction:column;overflow:hidden;">

  <!-- Topbar -->
  <div style="
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 20px;background:var(--bg2);border-bottom:1px solid var(--gris2);
    flex-shrink:0;
  ">
    <div style="font-family:var(--font-display);font-size:13px;color:var(--or);letter-spacing:3px;">BUILD SIMULATOR</div>
    <div style="display:flex;gap:8px;align-items:center;">
      <select id="bs-class-sel" onchange="PAGE_BUILD_SIM.setClass(this.value)" style="
        background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);
        font-family:var(--font-mono);font-size:9px;padding:5px 10px;
        letter-spacing:1px;outline:none;cursor:pointer;
      ">
        <option value="">Choisir une classe…</option>
        ${GD_CLASSES.map(c => `<option value="${c.id}">${c.emoji} ${c.nom} — ${c.archetype}</option>`).join('')}
      </select>
      <button onclick="PAGE_BUILD_SIM.reset()" style="
        background:transparent;border:1px solid var(--gris2);color:var(--txt2);
        font-family:var(--font-mono);font-size:8px;letter-spacing:1px;
        padding:6px 12px;cursor:pointer;transition:all .15s;
      " onmouseover="this.style.borderColor='var(--rouge)';this.style.color='var(--rouge)'"
         onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">
        Réinitialiser
      </button>
      <button onclick="PAGE_BUILD_SIM.exportCode()" style="
        background:var(--or);border:none;color:var(--bg);
        font-family:var(--font-display);font-size:9px;font-weight:700;
        letter-spacing:2px;padding:7px 16px;cursor:pointer;transition:background .15s;
        text-transform:uppercase;
      " onmouseover="this.style.background='var(--or2)'" onmouseout="this.style.background='var(--or)'">
        Exporter
      </button>
    </div>
  </div>

  <!-- Layout 3 colonnes -->
  <div style="display:grid;grid-template-columns:280px 1fr 300px;flex:1;overflow:hidden;">

    <!-- COLONNE GAUCHE — Slots du build -->
    <div style="background:var(--bg2);border-right:1px solid var(--gris2);overflow-y:auto;padding:14px;">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:10px;">SLOTS DU BUILD</div>

      <!-- Info classe -->
      <div id="bs-class-info" style="margin-bottom:14px;"></div>

      <!-- Slots -->
      <div id="bs-slots" style="display:flex;flex-direction:column;gap:6px;"></div>

      <!-- Reliques -->
      <div style="margin-top:20px;">
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;padding-top:14px;border-top:1px solid var(--gris2);">RELIQUES (${this.state.reliques.length})</div>
        <div id="bs-relics-active" style="display:flex;flex-direction:column;gap:4px;"></div>
        <button onclick="PAGE_BUILD_SIM.setTab('relics')" style="
          width:100%;margin-top:6px;background:transparent;
          border:1px dashed var(--gris2);color:var(--txt3);
          font-family:var(--font-mono);font-size:8px;letter-spacing:1px;
          padding:7px;cursor:pointer;transition:all .15s;
        " onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'"
           onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt3)'">
          + Ajouter relique
        </button>
      </div>

      <!-- Synergies actives -->
      <div id="bs-synergies" style="margin-top:20px;"></div>
    </div>

    <!-- COLONNE CENTRE — Catalogue -->
    <div style="display:flex;flex-direction:column;overflow:hidden;background:var(--bg);">

      <!-- Onglets -->
      <div style="display:flex;border-bottom:1px solid var(--gris2);background:var(--bg2);flex-shrink:0;">
        ${['triggers','effects','relics'].map(tab => `
          <button onclick="PAGE_BUILD_SIM.setTab('${tab}')" id="bs-tab-${tab}" style="
            font-family:var(--font-mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;
            background:transparent;border:none;border-bottom:2px solid transparent;
            color:var(--txt2);padding:12px 20px;cursor:pointer;transition:all .15s;
          ">${tab === 'triggers' ? '⚡ Déclencheurs' : tab === 'effects' ? '💥 Effets' : '💎 Reliques'}</button>
        `).join('')}
      </div>

      <!-- Filtres -->
      <div style="display:flex;gap:8px;padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--gris2);flex-shrink:0;flex-wrap:wrap;">
        <input id="bs-search" placeholder="Nom, tag…" oninput="PAGE_BUILD_SIM.renderCatalog()" style="
          background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);
          font-family:var(--font-mono);font-size:9px;padding:5px 10px;width:160px;outline:none;
        " onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
        <select id="bs-rar" onchange="PAGE_BUILD_SIM.renderCatalog()" style="
          background:var(--bg3);border:1px solid var(--gris2);color:var(--txt);
          font-family:var(--font-mono);font-size:9px;padding:5px 10px;outline:none;cursor:pointer;
        ">
          <option value="">Toutes raretés</option>
          ${['Commun','Rare','Épique','Légendaire'].map(r => `<option>${r}</option>`).join('')}
        </select>
        <span id="bs-count" style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);align-self:center;"></span>
      </div>

      <!-- Liste catalogue -->
      <div id="bs-catalog" style="overflow-y:auto;flex:1;padding:10px 14px;display:flex;flex-direction:column;gap:4px;"></div>
    </div>

    <!-- COLONNE DROITE — Stats & Export -->
    <div style="background:var(--bg2);border-left:1px solid var(--gris2);overflow-y:auto;padding:14px;">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:12px;">STATISTIQUES</div>
      <div id="bs-stats" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>

      <!-- Tags actifs -->
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;padding-top:14px;border-top:1px solid var(--gris2);">TAGS DU BUILD</div>
      <div id="bs-tags" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:20px;"></div>

      <!-- Code export -->
      <div style="padding-top:14px;border-top:1px solid var(--gris2);">
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;">CODE BUILD</div>
        <div id="bs-code" style="
          background:var(--bg3);border:1px solid var(--gris2);
          padding:10px;font-family:var(--font-mono);font-size:8px;
          color:var(--txt2);letter-spacing:1px;word-break:break-all;
          min-height:48px;line-height:1.8;
        ">—</div>
        <button onclick="PAGE_BUILD_SIM.copyCode()" style="
          width:100%;margin-top:6px;background:transparent;
          border:1px solid var(--gris2);color:var(--txt2);
          font-family:var(--font-mono);font-size:8px;letter-spacing:1px;
          padding:7px;cursor:pointer;transition:all .15s;text-transform:uppercase;
        " onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'"
           onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">
          📋 Copier le code
        </button>
      </div>
    </div>
  </div>
</div>`;
  },

  init() {
    this.setTab('triggers');
    this.renderSlots();
    this.renderStats();
  },

  setClass(id) {
    const cls = GD.findClass(id);
    this.state.classe = cls || null;
    this.state.slots = [];
    this.state.reliques = [];
    if (cls) {
      // Slots identitaires vides symboliques
      this.state.slots = [{ trigger: null, effect: null, identity: true }, { trigger: null, effect: null, identity: true }];
      // + slots standard
      for (let i = 0; i < 4; i++) this.state.slots.push({ trigger: null, effect: null, identity: false });
    }
    this.renderSlots();
    this.renderClassInfo();
    this.renderStats();
    this.renderCatalog();
  },

  renderClassInfo() {
    const el = document.getElementById('bs-class-info');
    if (!el) return;
    const cls = this.state.classe;
    if (!cls) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div style="background:var(--bg3);border:1px solid var(--gris2);padding:12px;border-top:2px solid ${cls.color};">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="font-size:22px;">${cls.emoji}</span>
          <div>
            <div style="font-family:var(--font-display);font-size:.95rem;color:var(--creme);">${cls.nom}</div>
            <div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);letter-spacing:1px;">${cls.archetype}</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">
          ${cls.tags.map(t => `<span style="font-family:var(--font-mono);font-size:7px;color:${cls.color};border:1px solid ${cls.color};padding:1px 5px;opacity:.8;">${t}</span>`).join('')}
        </div>
      </div>`;
  },

  renderSlots() {
    const el = document.getElementById('bs-slots');
    if (!el) return;
    if (!this.state.classe) {
      el.innerHTML = `<div style="font-family:var(--font-mono);font-size:9px;color:var(--txt3);letter-spacing:1px;padding:20px;text-align:center;border:1px dashed var(--gris3);">Choisissez une classe pour commencer</div>`;
      return;
    }
    el.innerHTML = this.state.slots.map((slot, i) => {
      const isId = slot.identity;
      const color = isId ? 'var(--violet)' : 'var(--gris2)';
      return `
        <div style="background:var(--bg3);border:1px solid ${color};padding:10px;">
          <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:2px;color:${isId ? 'var(--violet)' : 'var(--txt3)'};margin-bottom:6px;">
            ${isId ? '◆ IDENTITAIRE' : `SLOT ${i - 1}`}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
            <div onclick="PAGE_BUILD_SIM.openPick(${i},'trigger')" style="
              background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;cursor:pointer;
              transition:border-color .15s;min-height:36px;
            " onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris3)'">
              ${slot.trigger
                ? `<div style="font-family:var(--font-mono);font-size:7px;color:var(--or);">⚡ ${slot.trigger.nom}</div>`
                : `<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);">+ Déclencheur</div>`}
            </div>
            <div onclick="PAGE_BUILD_SIM.openPick(${i},'effect')" style="
              background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;cursor:pointer;
              transition:border-color .15s;min-height:36px;
            " onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris3)'">
              ${slot.effect
                ? `<div style="font-family:var(--font-mono);font-size:7px;color:var(--ocre);">💥 ${slot.effect.nom}</div>`
                : `<div style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);">+ Effet</div>`}
            </div>
          </div>
          ${(slot.trigger || slot.effect)
            ? `<button onclick="PAGE_BUILD_SIM.clearSlot(${i})" style="
                width:100%;margin-top:4px;background:transparent;border:1px solid var(--gris3);
                color:var(--txt3);font-family:var(--font-mono);font-size:7px;
                padding:3px;cursor:pointer;letter-spacing:1px;transition:all .15s;
              " onmouseover="this.style.color='var(--rouge)';this.style.borderColor='var(--rouge)'"
                 onmouseout="this.style.color='var(--txt3)';this.style.borderColor='var(--gris3)'">✕ Vider</button>`
            : ''}
        </div>`;
    }).join('');
    this.renderRelicsActive();
    this.renderSynergies();
  },

  openPick(slotIdx, type) {
    this.state.editSlot = slotIdx;
    this.state.editType = type;
    this.setTab(type === 'trigger' ? 'triggers' : 'effects');
  },

  setTab(tab) {
    this.state.tab = tab;
    ['triggers','effects','relics'].forEach(t => {
      const btn = document.getElementById(`bs-tab-${t}`);
      if (!btn) return;
      btn.style.color = t === tab ? 'var(--or)' : 'var(--txt2)';
      btn.style.borderBottomColor = t === tab ? 'var(--or)' : 'transparent';
    });
    this.renderCatalog();
  },

  renderCatalog() {
    const el = document.getElementById('bs-catalog');
    const cnt = document.getElementById('bs-count');
    if (!el) return;
    const search = document.getElementById('bs-search')?.value.toLowerCase() || '';
    const rar = document.getElementById('bs-rar')?.value || '';
    const tab = this.state.tab;

    let items = [];
    if (tab === 'triggers') {
      items = GD_TRIGGERS.filter(t =>
        (!search || t.nom.toLowerCase().includes(search) || t.tags.join(' ').includes(search)) &&
        (!rar || t.rarete === rar)
      );
    } else if (tab === 'effects') {
      items = GD_EFFECTS.filter(e =>
        (!search || e.nom.toLowerCase().includes(search) || e.tags.join(' ').includes(search)) &&
        (!rar || e.r === rar)
      );
    } else {
      items = GD_RELICS.filter(r =>
        (!search || r.nom.toLowerCase().includes(search) || r.tags.join(' ').includes(search)) &&
        (!rar || r.rarete === rar)
      );
    }

    if (cnt) cnt.textContent = `${items.length} résultats`;

    el.innerHTML = items.map(item => {
      const isT = tab === 'triggers';
      const isR = tab === 'relics';
      const color = isT ? 'var(--or)' : isR ? 'var(--violet)' : 'var(--ocre)';
      const rarete = isT ? item.rarete : isR ? item.rarete : item.r;
      return `
        <div onclick="PAGE_BUILD_SIM.pick('${item.id}')" style="
          background:var(--bg2);border:1px solid var(--gris2);padding:10px 12px;
          cursor:pointer;transition:border-color .15s;
        " onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
            <span style="font-family:var(--font-display);font-size:.82rem;color:${color};letter-spacing:.5px;">${item.nom}</span>
            <span style="font-family:var(--font-mono);font-size:7px;color:${GD.rarityColor(rarete)};">${rarete}</span>
          </div>
          <div style="font-size:.78rem;color:var(--txt2);margin-bottom:6px;line-height:1.4;">${item.desc || item.effet || item.cond || ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;">
            ${(item.tags||[]).map(t => `<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 4px;">${t}</span>`).join('')}
          </div>
        </div>`;
    }).join('');
  },

  pick(id) {
    const { editSlot, editType, tab } = this.state;
    if (tab === 'relics') {
      const relic = GD_RELICS.find(r => r.id === id);
      if (relic && !this.state.reliques.find(r => r.id === id)) {
        this.state.reliques.push(relic);
        this.renderSlots();
        this.renderStats();
      }
      return;
    }
    if (editSlot === null) return;
    const item = tab === 'triggers' ? GD_TRIGGERS.find(t => t.id === id) : GD_EFFECTS.find(e => e.id === id);
    if (!item) return;
    if (editType === 'trigger') this.state.slots[editSlot].trigger = item;
    else                        this.state.slots[editSlot].effect  = item;
    this.state.editSlot = null;
    this.renderSlots();
    this.renderStats();
    this.generateCode();
  },

  clearSlot(i) {
    this.state.slots[i].trigger = null;
    this.state.slots[i].effect  = null;
    this.renderSlots();
    this.renderStats();
    this.generateCode();
  },

  renderRelicsActive() {
    const el = document.getElementById('bs-relics-active');
    if (!el) return;
    el.innerHTML = this.state.reliques.map((r, i) => `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg4);border:1px solid var(--gris3);padding:6px 8px;">
        <span style="font-family:var(--font-mono);font-size:7px;color:var(--violet);">💎 ${r.nom}</span>
        <button onclick="PAGE_BUILD_SIM.removeRelic(${i})" style="background:none;border:none;color:var(--txt3);cursor:pointer;font-size:9px;" onmouseover="this.style.color='var(--rouge)'" onmouseout="this.style.color='var(--txt3)'">✕</button>
      </div>`).join('');
  },

  removeRelic(i) {
    this.state.reliques.splice(i, 1);
    this.renderSlots();
    this.renderStats();
  },

  renderSynergies() {
    const el = document.getElementById('bs-synergies');
    if (!el) return;
    const buildTags = this.getBuildTags();
    const active = GD_SYNERGIES.filter(s => s.tags.some(t => buildTags.includes(t)));
    if (!active.length) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div style="padding-top:14px;border-top:1px solid var(--gris2);">
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--or);margin-bottom:8px;">SYNERGIES DÉTECTÉES</div>
        ${active.map(s => `
          <div style="background:var(--bg4);border:1px solid var(--vert);padding:8px 10px;margin-bottom:4px;border-left:2px solid var(--vert);">
            <div style="font-family:var(--font-display);font-size:.8rem;color:var(--vert);margin-bottom:4px;">${s.nom}</div>
            <div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);">◆ ${s.palier1}</div>
          </div>`).join('')}
      </div>`;
  },

  getBuildTags() {
    const tags = new Set();
    this.state.slots.forEach(s => {
      (s.trigger?.tags || []).forEach(t => tags.add(t));
      (s.effect?.tags  || []).forEach(t => tags.add(t));
    });
    this.state.reliques.forEach(r => (r.tags || []).forEach(t => tags.add(t)));
    if (this.state.classe) this.state.classe.tags.forEach(t => tags.add(t));
    return [...tags];
  },

  renderStats() {
    const el = document.getElementById('bs-stats');
    const tagsEl = document.getElementById('bs-tags');
    if (!el) return;
    const filled = this.state.slots.filter(s => s.trigger && s.effect).length;
    const total  = this.state.slots.length;
    const tags   = this.getBuildTags();
    el.innerHTML = [
      ['Slots remplis', `${filled} / ${total}`],
      ['Reliques',      `${this.state.reliques.length}`],
      ['Tags uniques',  `${tags.length}`],
      ['Synergies',     `${GD_SYNERGIES.filter(s => s.tags.some(t => tags.includes(t))).length}`],
    ].map(([l, v]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--gris3);">
        <span style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;">${l}</span>
        <span style="font-family:var(--font-display);font-size:.9rem;color:var(--or);">${v}</span>
      </div>`).join('');
    if (tagsEl) {
      tagsEl.innerHTML = tags.map(t => `<span style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);border:1px solid var(--gris3);padding:2px 6px;">${t}</span>`).join('');
    }
    this.generateCode();
  },

  generateCode() {
    const el = document.getElementById('bs-code');
    if (!el) return;
    if (!this.state.classe) { el.textContent = '—'; return; }
    // Encodage simplifié Base32-like pour démo
    const parts = [
      this.state.classe.id.substring(0, 3).toUpperCase(),
      ...this.state.slots.map(s => `${s.trigger?.id?.substring(3,6) || '000'}-${s.effect?.id?.substring(3,6) || '000'}`),
      ...this.state.reliques.map(r => r.id),
    ];
    const code = btoa(parts.join('|')).replace(/=/g,'').substring(0, 24).toUpperCase();
    el.textContent = `DK-${code}`;
  },

  copyCode() {
    const code = document.getElementById('bs-code')?.textContent || '—';
    navigator.clipboard?.writeText(code).then(() => {
      const btn = event.target;
      btn.textContent = '✅ Copié !';
      setTimeout(() => btn.textContent = '📋 Copier le code', 2000);
    });
  },

  exportCode() {
    const build = {
      classe: this.state.classe?.id,
      slots: this.state.slots.map(s => ({ trigger: s.trigger?.id, effect: s.effect?.id })),
      reliques: this.state.reliques.map(r => r.id),
    };
    const blob = new Blob([JSON.stringify(build, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `build_dethroned_${this.state.classe?.id || 'draft'}.json`;
    a.click();
  },

  reset() {
    this.state.classe = null;
    this.state.slots  = [];
    this.state.reliques = [];
    const sel = document.getElementById('bs-class-sel');
    if (sel) sel.value = '';
    this.renderSlots();
    this.renderClassInfo();
    this.renderStats();
    this.renderCatalog();
  },
};
