/**
 * pages/home.js — Page d'accueil / Pitch
 * Lit GD_CLASSES et GD_ARCHETYPES depuis gamedata.js
 */
window.PAGE_HOME = {
  render() {
    return `
<div class="page-enter">

  <!-- HERO -->
  <section style="
    min-height: 88vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 80px 60px 60px;
    position: relative;
    overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,69,19,.18) 0%, transparent 70%),
                linear-gradient(to bottom, var(--bg) 0%, var(--bg2) 100%);
  ">
    <!-- Motif hexagonal de fond -->
    <div style="position:absolute;inset:0;opacity:.04;pointer-events:none;overflow:hidden;">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,17 58,35 30,50 2,35 2,17" fill="none" stroke="#c8952a" stroke-width=".8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>
    </div>

    <!-- Badge Early Access -->
    <div style="margin-bottom:28px;">
      <span style="
        font-family:var(--font-mono);font-size:8px;letter-spacing:4px;
        color:var(--or);border:1px solid var(--or);padding:5px 14px;
        text-transform:uppercase;
      ">Early Access — Mars 2027</span>
    </div>

    <!-- Titre -->
    <h1 style="
      font-family:var(--font-display);font-size:clamp(48px,8vw,96px);
      font-weight:900;color:var(--creme);letter-spacing:6px;
      line-height:.95;margin-bottom:8px;
      text-shadow: 0 0 60px rgba(200,149,42,.3);
    ">DETHRONED</h1>
    <div style="
      font-family:var(--font-display);font-size:clamp(14px,2vw,20px);
      color:var(--or);letter-spacing:8px;font-weight:400;
      margin-bottom:36px;
    ">THE KING'S DEN</div>

    <!-- Accroche -->
    <p style="
      font-family:var(--font-body);font-size:1.25rem;font-style:italic;
      color:var(--creme2);max-width:580px;line-height:1.7;margin-bottom:40px;
    ">Un roguelite physique où vous incarnez une proie lancée comme une bille à travers des arènes hostiles, pour renverser le Lion sur son trône.</p>

    <!-- Tags gameplay -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:48px;">
      ${['Roguelite','Physique de bille','Build crafting','Arènes procédurales','Trône Renversé — Boss asynchrone'].map(t =>
        `<span style="font-family:var(--font-mono);font-size:8px;letter-spacing:2px;color:var(--txt2);border:1px solid var(--gris2);padding:4px 12px;">${t}</span>`
      ).join('')}
    </div>

    <!-- CTAs -->
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <a href="#build-sim" class="btn-primary" onclick="SPA.go('build-sim');return false;">
        ⚡ Essayer le Build Simulator
      </a>
      <a href="#arena-forge" class="btn-outline" onclick="SPA.go('arena-forge');return false;">
        🗺 Arena Forge
      </a>
    </div>

    <!-- Studio badge -->
    <div style="position:absolute;top:32px;right:60px;text-align:right;">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:var(--txt3);">BONAVENTURE STUDIO</div>
      <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:2px;color:var(--txt3);margin-top:3px;">MONTPELLIER — INDÉPENDANT</div>
    </div>
  </section>

  <!-- PITCH -->
  <section class="content-section" style="background:var(--bg2);">
    <div class="section-label">Le Concept</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:1100px;">
      <div>
        <h2 style="font-family:var(--font-display);font-size:1.8rem;color:var(--or);letter-spacing:2px;margin-bottom:20px;">Vous êtes la proie. Devenez le prédateur.</h2>
        <p style="color:var(--creme2);line-height:1.8;margin-bottom:16px;">Dans <em>Dethroned</em>, vous contrôlez un animal-bille propulsé dans des arènes remplies d'ennemis. La physique est votre arme : rebonds, vitesse, trajectoires calculées — chaque lancer est une décision.</p>
        <p style="color:var(--creme2);line-height:1.8;margin-bottom:16px;">À chaque run, vous composez un build unique depuis un système de compétences modulaire : <strong style="color:var(--or)">Déclencheurs</strong> + <strong style="color:var(--or)">Effets</strong>. Collision, rebond, kill, timer… chaque événement de jeu peut déclencher une cascade d'effets.</p>
        <p style="color:var(--creme2);line-height:1.8;">Vaincre le Lion génère un <strong style="color:var(--or)">Trône Renversé</strong> — votre build encodé devient un boss asynchrone défié par d'autres joueurs.</p>
      </div>
      <div>
        <div style="background:var(--bg3);border:1px solid var(--gris2);padding:28px;margin-bottom:16px;">
          <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--or);margin-bottom:16px;">12 CLASSES JOUABLES</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${GD_CLASSES.map(c => `
              <div style="
                display:flex;align-items:center;gap:6px;
                background:var(--bg4);border:1px solid var(--gris2);
                padding:5px 10px;cursor:default;
                transition:border-color .15s;
              " onmouseover="this.style.borderColor='${c.color}'" onmouseout="this.style.borderColor='var(--gris2)'">
                <span style="font-size:14px;">${c.emoji}</span>
                <span style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);">${c.nom}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--gris2);padding:20px;">
          <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--or);margin-bottom:12px;">STEAM EARLY ACCESS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            ${[['9,99€','Early Access Mars 2027'],['5 classes','+ 2 biomes au lancement'],['12,99€','Version complète ~2028'],['100+ effets','88 déclencheurs']].map(([v,l]) => `
              <div>
                <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--or);font-weight:700;">${v}</div>
                <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">${l}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MÉCANIQUE SIGNATURE -->
  <section class="content-section">
    <div class="section-label">Mécanique Signature</div>
    <div style="max-width:900px;">
      <h2 style="font-family:var(--font-display);font-size:1.6rem;color:var(--or);letter-spacing:2px;margin-bottom:20px;">⚡ Trône Renversé</h2>
      <p style="color:var(--creme2);line-height:1.8;font-size:1.05rem;margin-bottom:24px;">Quand vous battez le Lion, votre build gagnant est encodé en <strong style="color:var(--or)">Base32</strong> et partagé avec la communauté. D'autres joueurs affrontent alors une version IA de votre stratégie — vos déclencheurs, vos effets, vos synergies — comme un boss asynchrone unique.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
        ${[
          ['🏆','Victoire','Vous battez le Lion avec un build unique'],
          ['📡','Encodage','Le build est encodé Base32 et partagé'],
          ['👾','Boss asynchrone','D\'autres joueurs affrontent votre stratégie'],
        ].map(([icon,titre,desc]) => `
          <div style="background:var(--bg2);border:1px solid var(--gris2);padding:24px;border-top:2px solid var(--or);">
            <div style="font-size:24px;margin-bottom:12px;">${icon}</div>
            <div style="font-family:var(--font-display);font-size:.95rem;color:var(--or);letter-spacing:2px;margin-bottom:8px;">${titre}</div>
            <div style="font-size:.9rem;color:var(--creme2);line-height:1.6;">${desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- ARCHETYPES -->
  <section class="content-section" style="background:var(--bg2);">
    <div class="section-label">10 Archétypes de Build</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;max-width:1100px;">
      ${GD_ARCHETYPES.map(a => `
        <div style="
          background:var(--bg3);border:1px solid var(--gris2);padding:16px;
          transition:border-color .15s;cursor:default;
        " onmouseover="this.style.borderColor='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)'">
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
  }
};
