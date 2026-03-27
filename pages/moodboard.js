/**
 * pages/moodboard.js — Moodboard Canva embarqué
 */
window.PAGE_MOODBOARD = {
  render() {
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

  <!-- Embed Canva -->
  <div style="padding:40px 60px;background:var(--bg2);border-bottom:1px solid var(--gris2);">
    <div style="position:relative;width:100%;height:0;padding-top:100%;box-shadow:0 2px 8px 0 rgba(63,69,81,.16);overflow:hidden;border-radius:4px;will-change:transform;border:1px solid var(--gris2);">
      <iframe loading="lazy"
        style="position:absolute;width:100%;height:100%;top:0;left:0;border:none;padding:0;margin:0;"
        src="https://www.canva.com/design/DAHCOCTjWLY/HJkkH8J6_bIehJoXGSxyCA/view?embed"
        allowfullscreen="allowfullscreen"
        allow="fullscreen">
      </iframe>
    </div>
    <div style="margin-top:12px;text-align:center;">
      <a href="https://www.canva.com/design/DAHCOCTjWLY/HJkkH8J6_bIehJoXGSxyCA/view?utm_content=DAHCOCTjWLY&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
        target="_blank" rel="noopener"
        style="font-family:var(--font-mono);font-size:9px;letter-spacing:2px;color:var(--txt2);text-decoration:none;transition:color .15s;"
        onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--txt2)'">
        Ouvrir sur Canva ↗ — Dethroned Moodboard par Thomas Lebel
      </a>
    </div>
  </div>

  <!-- Palette -->
  <section class="content-section">
    <div class="section-label">Palette de couleurs</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;max-width:900px;">
      ${[
        ['#F2B749','Or Principal','UI, accentuation'],
        ['#A65526','Brun Terre','Structures, sol'],
        ['#D9965B','Ocre','Transitions naturelles'],
        ['#557340','Forêt','Biome Forêt'],
        ['#8B4513','Savane','Biome Savane'],
        ['#0D0A07','Noir Profond','Fond principal'],
        ['#F5EDD8','Crème','Texte, UI claire'],
        ['#4AB8E8','Bleu Vitesse','Indicateurs vitesse'],
        ['#FF4422','Feu','Élément Feu'],
        ['#6DB33F','Poison','Élément Poison'],
        ['#7BD4F0','Glace','Élément Eau'],
        ['#E8B84A','Or Clair','Légendes, boss'],
      ].map(([c,n,d]) => `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="width:88px;height:64px;background:${c};border:1px solid rgba(255,255,255,.1);"></div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--or);">${c}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);">${n}</div>
          <div style="font-size:.75rem;color:var(--txt3);max-width:88px;line-height:1.4;">${d}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Typo -->
  <section class="content-section" style="background:var(--bg2);">
    <div class="section-label">Typographie</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;">
      ${[
        ['Cinzel', 'font-family:Cinzel,serif', 'Titres, UI importante', 'ABCDEFGHIJKLM'],
        ['Crimson Pro', 'font-family:"Crimson Pro",serif', 'Corps de texte, descriptions', 'abcdefghijklm'],
        ['Space Mono', 'font-family:"Space Mono",monospace', 'Données, codes, UI technique', 'abcdefghijklm'],
      ].map(([name,style,use,sample]) => `
        <div style="background:var(--bg3);border:1px solid var(--gris2);padding:20px;">
          <div style="${style};font-size:1.6rem;color:var(--creme);margin-bottom:8px;">${sample}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--or);letter-spacing:2px;margin-bottom:4px;">${name}</div>
          <div style="font-size:.8rem;color:var(--txt2);">${use}</div>
        </div>
      `).join('')}
    </div>
  </section>
</div>`;
  },

  init() {}
};
