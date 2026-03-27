/**
 * pages/home.js — Page d'accueil / Pitch
 * Carrousel infini de compétences générées selon les règles réelles (ciblage + rareté)
 */
window.PAGE_HOME = {

  _carouselTimer: null,
  _carouselPos: 0,

  render() {
    return `
<div class="page-enter">

  <!-- ════ HERO ════ -->
  <section style="
    min-height: 88vh;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 80px 60px 60px; position: relative; overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,69,19,.18) 0%, transparent 70%),
                linear-gradient(to bottom, var(--bg) 0%, var(--bg2) 100%);
  ">
    <div style="position:absolute;inset:0;opacity:.04;pointer-events:none;overflow:hidden;">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,2 58,17 58,35 30,50 2,35 2,17" fill="none" stroke="#c8952a" stroke-width=".8"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>
    </div>
    <div style="margin-bottom:28px;">
      <span style="font-family:var(--font-mono);font-size:8px;letter-spacing:4px;color:var(--or);border:1px solid var(--or);padding:5px 14px;text-transform:uppercase;">Early Access — Mars 2027</span>
    </div>
    <h1 style="font-family:var(--font-display);font-size:clamp(48px,8vw,96px);font-weight:900;color:var(--creme);letter-spacing:6px;line-height:.95;margin-bottom:8px;text-shadow:0 0 60px rgba(200,149,42,.3);">DETHRONED</h1>
    <div style="font-family:var(--font-display);font-size:clamp(14px,2vw,20px);color:var(--or);letter-spacing:8px;font-weight:400;margin-bottom:36px;">THE KING'S DEN</div>
    <p style="font-family:var(--font-body);font-size:1.25rem;font-style:italic;color:var(--creme2);max-width:580px;line-height:1.7;margin-bottom:40px;">Un roguelite physique où vous incarnez une proie lancée comme une bille à travers des arènes hostiles, pour renverser le Lion sur son trône.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:48px;">
      ${['Roguelite','Physique de bille','Build crafting','Arènes procédurales','Trône Renversé'].map(t =>
        `<span style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;color:var(--txt2);border:1px solid var(--gris2);padding:4px 12px;">${t}</span>`
      ).join('')}
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <a href="#build-sim" class="btn-primary" onclick="SPA.go('build-sim');return false;">⚡ Build Simulator</a>
      <a href="#arena-forge" class="btn-outline" onclick="SPA.go('arena-forge');return false;">🗺 Arena Forge</a>
    </div>
    <div style="position:absolute;top:32px;right:60px;text-align:right;">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--txt3);">BONAVENTURE STUDIO</div>
      <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:2px;color:var(--txt3);margin-top:3px;">MONTPELLIER — INDÉPENDANT</div>
    </div>
  </section>

  <!-- ════ PITCH ════ -->
  <section class="content-section" style="background:var(--bg2);">
    <div class="section-label">Le Concept</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:1100px;">
      <div>
        <h2 style="font-family:var(--font-display);font-size:1.8rem;color:var(--or);letter-spacing:2px;margin-bottom:20px;">Vous êtes la proie. Devenez le prédateur.</h2>
        <p style="color:var(--creme2);line-height:1.8;margin-bottom:16px;">Dans <em>Dethroned</em>, vous contrôlez un animal-bille propulsé dans des arènes remplies d'ennemis. La physique est votre arme : rebonds, vitesse, trajectoires calculées — chaque lancer est une décision tactique.</p>
        <p style="color:var(--creme2);line-height:1.8;">À chaque run, vous composez un build unique en assemblant <strong style="color:var(--or)">Déclencheurs</strong> et <strong style="color:var(--or)">Effets</strong>. Collision, rebond, kill, timer… chaque événement du jeu peut déclencher une cascade d'effets sur mesure.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:var(--bg3);border:1px solid var(--gris2);padding:20px;">
          <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--or);margin-bottom:14px;">EARLY ACCESS — MARS 2027</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            ${[['9,99€','Prix Early Access'],['5 classes','+ 2 biomes'],['12,99€','Version complète ~2028'],['100+ effets','88 déclencheurs']].map(([v,l]) =>
              `<div><div style="font-family:var(--font-display);font-size:1.1rem;color:var(--or);font-weight:700;">${v}</div><div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">${l}</div></div>`
            ).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ════ MÉCANIQUES SIGNATURES ════ -->
  <section class="content-section">
    <div class="section-label">Mécaniques Signatures</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:1100px;">

      <!-- Trône Renversé -->
      <div style="background:var(--bg2);border:1px solid var(--gris2);padding:32px;border-top:3px solid var(--or);">
        <div style="font-size:32px;margin-bottom:16px;">👑</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;color:var(--or);letter-spacing:2px;margin-bottom:14px;">Trône Renversé</h3>
        <p style="color:var(--creme2);line-height:1.8;font-size:.95rem;margin-bottom:20px;">Quand vous battez le Lion, votre build gagnant est <strong style="color:var(--or)">encodé en Base32</strong> et partagé avec la communauté. D'autres joueurs affrontent alors une version IA de votre stratégie — vos déclencheurs, vos effets, vos synergies — comme un boss asynchrone unique.</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${[['🏆','Victoire','Vous battez le Lion avec un build unique'],['📡','Encodage','Le build est sérialisé en Base32 et partagé'],['👾','Boss asynchrone','La communauté affronte votre stratégie'],].map(([i,t,d]) =>
            `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;background:var(--bg3);border-left:2px solid var(--or);">
              <span style="font-size:16px;flex-shrink:0;">${i}</span>
              <div><div style="font-family:var(--font-mono);font-size:8px;color:var(--or);letter-spacing:1px;margin-bottom:3px;">${t}</div><div style="font-size:.82rem;color:var(--txt2);line-height:1.5;">${d}</div></div>
            </div>`
          ).join('')}
        </div>
      </div>

      <!-- Compétences Modulables -->
      <div style="background:var(--bg2);border:1px solid var(--gris2);padding:32px;border-top:3px solid var(--bleu);">
        <div style="font-size:32px;margin-bottom:16px;">⚡</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;color:var(--bleu);letter-spacing:2px;margin-bottom:14px;">Compétences Modulables</h3>
        <p style="color:var(--creme2);line-height:1.8;font-size:.95rem;margin-bottom:20px;">Chaque compétence est une combinaison libre d'un <strong style="color:var(--or)">Déclencheur</strong> et d'un <strong style="color:var(--ocre)">Effet</strong>. Le déclencheur définit <em>quand</em> — collision, rebond, kill, timer. L'effet définit <em>quoi</em> — dégâts, DoT, contrôle, invocation. Assemblez-les librement selon vos 6 slots.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
          ${[['⚡ Déclencheur','Collision Standard','À chaque contact avec un ennemi','var(--or)'],['💥 Effet','Hémorragie','Applique 1 stack Saignement (3 PV/s)','var(--ocre)'],['→ Résultat','Saignement au contact','Chaque collision saigne la cible','var(--vert)']].map(([l,t,d,c]) =>
            `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 12px;background:var(--bg3);border-left:2px solid ${c};">
              <div style="font-family:var(--font-mono);font-size:7px;color:${c};letter-spacing:1px;min-width:80px;flex-shrink:0;">${l}</div>
              <div><div style="font-family:var(--font-display);font-size:.82rem;color:var(--creme);margin-bottom:2px;">${t}</div><div style="font-size:.78rem;color:var(--txt2);">${d}</div></div>
            </div>`
          ).join('')}
        </div>
        <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;">88 déclencheurs · 100+ effets · 10 archétypes de build</div>
      </div>
    </div>
  </section>

  <!-- ════ CARROUSEL COMPÉTENCES ════ -->
  <section style="padding:48px 0;background:var(--bg3);border-bottom:1px solid var(--gris2);border-top:1px solid var(--gris2);overflow:hidden;">
    <div style="padding:0 60px;margin-bottom:24px;">
      <div class="section-label">Compétences — Exemples générés</div>
      <p style="font-size:.9rem;color:var(--txt2);font-style:italic;">Combinaisons déclencheur + effet respectant les règles réelles de build (compatibilité ciblage · rareté ≤ déclencheur)</p>
    </div>
    <div style="position:relative;overflow:hidden;">
      <div id="carousel-track" style="display:flex;gap:12px;transition:transform .6s cubic-bezier(.4,0,.2,1);will-change:transform;padding:0 60px 0 60px;"></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:20px;">
      <button onclick="PAGE_HOME.carouselPrev()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:10px;padding:6px 14px;cursor:pointer;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">◀</button>
      <button onclick="PAGE_HOME.carouselShuffle()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:8px;letter-spacing:2px;padding:6px 14px;cursor:pointer;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">↺ REGÉNÉRER</button>
      <button onclick="PAGE_HOME.carouselNext()" style="background:transparent;border:1px solid var(--gris2);color:var(--txt2);font-family:var(--font-mono);font-size:10px;padding:6px 14px;cursor:pointer;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">▶</button>
    </div>
  </section>

  <!-- ════ 12 CLASSES ════ -->
  <section class="content-section" style="background:var(--bg2);">
    <div class="section-label">12 Classes Jouables</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;max-width:1200px;">
      ${GD_CLASSES.map(c => `
        <div style="background:var(--bg3);border:1px solid var(--gris2);padding:18px;border-left:3px solid ${c.color};transition:border-color .15s;cursor:default;" onmouseover="this.style.borderColor='${c.color}'" onmouseout="this.style.borderColor='var(--gris2)'">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="font-size:24px;">${c.emoji}</span>
            <div>
              <div style="font-family:var(--font-display);font-size:.95rem;color:var(--creme);letter-spacing:1px;">${c.nom}</div>
              <div style="font-family:var(--font-mono);font-size:7px;color:${c.color};letter-spacing:1px;margin-top:2px;">${c.archetype}</div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
            <span style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 6px;">${c.element}</span>
            <span style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 6px;">${c.biome}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;">
            ${c.tags.slice(0,4).map(t => `<span style="font-family:var(--font-mono);font-size:6px;color:${c.color};border:1px solid ${c.color};padding:1px 4px;opacity:.7;">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- ════ ARCHETYPES ════ -->
  <section class="content-section">
    <div class="section-label">10 Archétypes de Build</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;max-width:1100px;">
      ${GD_ARCHETYPES.map(a => `
        <div style="background:var(--bg2);border:1px solid var(--gris2);padding:16px;transition:border-color .15s;cursor:default;" onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'">
          <div style="font-family:var(--font-display);font-size:.85rem;color:var(--or);letter-spacing:1px;margin-bottom:8px;">${a.nom}</div>
          <div style="font-size:.82rem;color:var(--txt2);line-height:1.5;margin-bottom:10px;">${a.desc}</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;">
            ${a.tags.slice(0,3).map(t => `<span style="font-family:var(--font-mono);font-size:7px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 5px;">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </section>

</div>`;
  },

  // ── Règles réelles de génération de compétences ──
  // Rareté ordonnée (index croissant = plus rare)
  RARETY_ORDER: ['Commun', 'Rare', 'Épique', 'Légendaire'],

  // Compatibilité ciblage : loc_type du trigger doit matcher req_ de l'effect
  LOC_TO_REQ: {
    '#loc_cible':  ['#req_cible'],
    '#loc_point':  ['#req_point', '#req_cible'],
    '#loc_soi':    ['#req_soi', '#req_global'],
    '#loc_global': ['#req_global', '#req_soi'],
  },

  _randFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  _rarityIndex(r) {
    return this.RARETY_ORDER.indexOf(r);
  },

  _effectsCompatibleWith(trigger) {
    const allowedReqs = this.LOC_TO_REQ[trigger.loc] || ['#req_cible'];
    const trigRarIdx  = this._rarityIndex(trigger.rarete);
    return GD_EFFECTS.filter(e => {
      // Ciblage compatible
      if (!allowedReqs.includes(e.req)) return false;
      // Rareté effet ≤ rareté déclencheur
      const effRarIdx = this._rarityIndex(e.r);
      if (effRarIdx > trigRarIdx) return false;
      return true;
    });
  },

  generateSkillCards(count = 18) {
    const cards = [];
    let attempts = 0;
    const triggers = [...GD_TRIGGERS].sort(() => Math.random() - .5);
    for (const trig of triggers) {
      if (cards.length >= count) break;
      attempts++;
      if (attempts > 200) break;
      const compatible = this._effectsCompatibleWith(trig);
      if (!compatible.length) continue;
      const effect = this._randFrom(compatible);
      cards.push({ trigger: trig, effect });
    }
    return cards;
  },

  _rarityGlow(r) {
    return { Commun:'#6a6a6a', Rare:'#4a7aaa', Épique:'#8a5aaa', Légendaire:'#c8952a' }[r] || '#6a6a6a';
  },

  renderCard(skill) {
    const { trigger: t, effect: e } = skill;
    const color = this._rarityGlow(t.rarete);
    return `
      <div style="
        flex-shrink:0;width:210px;
        background:var(--bg2);border:1px solid ${color};
        padding:14px;border-top:2px solid ${color};
        display:flex;flex-direction:column;gap:8px;
      ">
        <!-- Trigger -->
        <div style="padding:8px 10px;background:var(--bg3);border-left:2px solid var(--or);">
          <div style="font-family:var(--font-mono);font-size:6px;letter-spacing:2px;color:var(--or);margin-bottom:4px;">⚡ DÉCLENCHEUR · ${t.rarete.toUpperCase()}</div>
          <div style="font-family:var(--font-display);font-size:.8rem;color:var(--creme);margin-bottom:4px;">${t.nom}</div>
          <div style="font-size:.72rem;color:var(--txt2);line-height:1.4;">${t.cond || ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:5px;">
            ${(t.tags||[]).slice(0,3).map(tag => `<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 3px;">${tag}</span>`).join('')}
          </div>
        </div>
        <!-- Effect -->
        <div style="padding:8px 10px;background:var(--bg3);border-left:2px solid var(--ocre);">
          <div style="font-family:var(--font-mono);font-size:6px;letter-spacing:2px;color:var(--ocre);margin-bottom:4px;">💥 EFFET · ${e.r.toUpperCase()}</div>
          <div style="font-family:var(--font-display);font-size:.8rem;color:var(--creme);margin-bottom:4px;">${e.nom.split(' — ')[1] || e.nom}</div>
          <div style="font-size:.72rem;color:var(--txt2);line-height:1.4;">${e.desc || ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:5px;">
            ${(e.tags||[]).slice(0,3).map(tag => `<span style="font-family:var(--font-mono);font-size:6px;color:var(--txt3);border:1px solid var(--gris3);padding:1px 3px;">${tag}</span>`).join('')}
          </div>
        </div>
        <!-- Compatibilité -->
        <div style="font-family:var(--font-mono);font-size:6px;color:var(--vert);letter-spacing:1px;text-align:center;">✓ ${t.loc} ↔ ${e.req}</div>
      </div>`;
  },

  _cards: [],
  _offset: 0,
  CARD_W: 222, // card width + gap

  init() {
    this._cards = this.generateSkillCards(24);
    this._offset = 0;
    this._renderTrack();
    this._startAuto();
  },

  _renderTrack() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    track.innerHTML = this._cards.map(c => this.renderCard(c)).join('');
    track.style.transform = `translateX(-${this._offset * this.CARD_W}px)`;
  },

  _startAuto() {
    if (this._carouselTimer) clearInterval(this._carouselTimer);
    this._carouselTimer = setInterval(() => {
      if (!document.getElementById('carousel-track')) {
        clearInterval(this._carouselTimer);
        return;
      }
      this.carouselNext();
    }, 2800);
  },

  carouselNext() {
    const maxOffset = Math.max(0, this._cards.length - 5);
    this._offset = this._offset >= maxOffset ? 0 : this._offset + 1;
    const track = document.getElementById('carousel-track');
    if (track) track.style.transform = `translateX(-${this._offset * this.CARD_W}px)`;
  },

  carouselPrev() {
    const maxOffset = Math.max(0, this._cards.length - 5);
    this._offset = this._offset <= 0 ? maxOffset : this._offset - 1;
    const track = document.getElementById('carousel-track');
    if (track) track.style.transform = `translateX(-${this._offset * this.CARD_W}px)`;
  },

  carouselShuffle() {
    this._cards = this.generateSkillCards(24);
    this._offset = 0;
    this._renderTrack();
  },
};
