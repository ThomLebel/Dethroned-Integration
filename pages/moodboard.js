/**
 * pages/moodboard.js — Embed Canva Moodboard
 */
window.PAGE_MOODBOARD = {
  // Remplace CANVA_EMBED_URL par ton lien embed Canva
  CANVA_URL: 'https://www.canva.com/design/DAHCOCTjWLY/HJkkH8J6_bIehJoXGSxyCA/view',

  render() {
    const hasUrl = this.CANVA_URL !== 'CANVA_EMBED_URL';
    return `
<div class="page-enter">
  <div class="page-hero">
    <div class="section-label">Direction Artistique</div>
    <h1>Moodboard</h1>
    <p class="lead">Références visuelles, palette couleurs, style low-poly cartoon — l'identité visuelle de <em>Dethroned: The King's Den</em>.</p>
    <div class="tag-list">
      <span class="tag-pill accent">Low-Poly Cartoon</span>
      <span class="tag-pill">Brawl Stars ref.</span>
      <span class="tag-pill">2D Billboard VFX</span>
      <span class="tag-pill">UI Vectorielle</span>
      <span class="tag-pill">Nujabes Aesthetic</span>
    </div>
  </div>

  <div style="padding:0;background:var(--bg2);border-bottom:1px solid var(--gris2);">
    ${hasUrl
      ? `<iframe src="${this.CANVA_URL}"
          style="width:100%;height:calc(100vh - var(--nav-h) - 200px);border:none;display:block;"
          allowfullscreen loading="lazy">
        </iframe>`
      : `<div style="
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            min-height:60vh;gap:24px;padding:60px;
          ">
          <div style="font-size:48px;opacity:.3;">🎨</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--or);letter-spacing:2px;text-align:center;">Moodboard Canva</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--txt2);letter-spacing:2px;max-width:420px;text-align:center;line-height:1.8;">
            Pour intégrer ton moodboard Canva :<br>
            <span style="color:var(--or)">Canva → Partager → Publier sur le web → Embed</span><br>
            Puis remplace <code>CANVA_EMBED_URL</code> dans <code>pages/moodboard.js</code>
          </div>
          <div style="border:1px dashed var(--gris2);padding:20px 32px;font-family:var(--font-mono);font-size:9px;color:var(--txt3);letter-spacing:1px;">
            CANVA_EMBED_URL = placeholder
          </div>
        </div>`
    }
  </div>

  <section class="content-section">
    <div class="section-label">Palette de couleurs</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:800px;">
      ${[
        ['#F2B749','Or Principal','Interfaces, accentuation'],
        ['#A65526','Brun Terre','Structures, sol'],
        ['#D9965B','Ocre','Transitions, éléments naturels'],
        ['#557340','Forêt','Biome Forêt, végétation'],
        ['#8B4513','Savane','Biome Savane, terre sèche'],
        ['#0D0A07','Noir Profond','Fond principal'],
        ['#F5EDD8','Crème','Texte, UI claire'],
        ['#4AB8E8','Bleu Vitesse','Indicateurs de vitesse'],
        ['#FF4422','Feu','Élément Feu, danger'],
        ['#6DB33F','Poison','Élément Poison'],
      ].map(([color,nom,desc]) => `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="
            width:80px;height:56px;background:${color};
            border:1px solid rgba(255,255,255,.1);
          "></div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--or);">${color}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);">${nom}</div>
          <div style="font-size:.75rem;color:var(--txt3);max-width:80px;line-height:1.4;">${desc}</div>
        </div>
      `).join('')}
    </div>
  </section>
</div>`;
  }
};
