/**
 * pages/playlist.js — Playlist musiques Dethroned
 *
 * YouTube  → embed iframe natif (playlist complète, lecture directe ✅)
 * Epidemic Sound → widget soigné + lien direct (pas d'API publique ❌)
 * Uppbeat  → widget soigné + lien direct (pas d'embed public ❌)
 */
window.PAGE_PLAYLIST = {

  YT_PLAYLIST_ID: 'PL_bzE9_8pWxvFP-BBSWUu-FVLwHtBkA2c',
  ES_URL: 'https://www.epidemicsound.com/playlist/49tx3oejbigal5330ltd13opdmr20wn6/',
  UB_URL: 'https://uppbeat.io/my/boards/shared/5452b3b2-802d-46e6-8d9a-9627e33dff5b',

  render() {
    return `
<div class="page-enter">
  <div class="page-hero">
    <div class="section-label">Musiques du Jeu</div>
    <h1>Playlist</h1>
    <p class="lead">Références musicales pour <em>Dethroned</em> — lo-fi hip-hop, jazz instrumental, ambient. Inspiré de l'esthétique Nujabes / Samurai Champloo.</p>
    <div class="tag-list">
      <span class="tag-pill accent">Lo-fi Hip-Hop</span>
      <span class="tag-pill">Jazz Instrumental</span>
      <span class="tag-pill">Nujabes</span>
      <span class="tag-pill">Samurai Champloo</span>
      <span class="tag-pill">Ambient</span>
    </div>
  </div>

  <div style="padding:48px 60px;display:flex;flex-direction:column;gap:40px;">

    <!-- ══ YOUTUBE — Lecteur embarqué natif ══ -->
    <div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#ff0000;border-radius:50%;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.52 12 3.52 12 3.52s-7.51 0-9.38.53A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.49 20.48 12 20.48 12 20.48s7.51 0 9.38-.53a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.54 15.57V8.43L15.82 12l-6.28 3.57z"/></svg>
        </div>
        <div>
          <div style="font-family:var(--font-display);font-size:1rem;color:var(--or);letter-spacing:2px;">YouTube</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">Playlist complète — lecture directe</div>
        </div>
        <a href="https://youtube.com/playlist?list=${this.YT_PLAYLIST_ID}" target="_blank" style="margin-left:auto;font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;text-decoration:none;border:1px solid var(--gris2);padding:5px 10px;transition:all .15s;" onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'" onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt3)'">Ouvrir YouTube ↗</a>
      </div>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;background:var(--bg2);border:1px solid var(--gris2);">
        <iframe
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
          src="https://www.youtube.com/embed/videoseries?list=${this.YT_PLAYLIST_ID}&autoplay=0&rel=0&modestbranding=1&color=white"
          title="Dethroned — Playlist YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    </div>

    <!-- ══ EPIDEMIC SOUND & UPPBEAT côte à côte ══ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

      <!-- Epidemic Sound -->
      <div style="background:var(--bg2);border:1px solid var(--gris2);overflow:hidden;">
        <div style="padding:20px 24px;border-bottom:1px solid var(--gris2);display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;background:#1db954;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.25 16.87c-.22.35-.68.47-1.03.25C13.88 15.4 10.6 15.07 6.7 16c-.4.09-.8-.16-.89-.56-.09-.4.16-.8.56-.89 4.27-1.02 7.93-.67 10.64.98.35.22.46.68.24 1.04zm1.4-3.11c-.28.43-.86.57-1.29.29-2.83-1.74-7.14-2.24-10.49-1.23-.48.14-.99-.14-1.13-.62-.14-.48.14-.99.62-1.13 3.82-1.16 8.56-.6 11.81 1.4.43.28.57.87.28 1.29zm.12-3.24c-3.39-2.01-8.98-2.2-12.22-1.21-.52.16-1.06-.14-1.21-.65-.16-.52.14-1.06.65-1.21 3.71-1.13 9.88-.91 13.78 1.4.5.3.67 1 .37 1.5-.3.5-1 .67-1.5.37z"/></svg>
          </div>
          <div>
            <div style="font-family:var(--font-display);font-size:.9rem;color:var(--or);letter-spacing:2px;">Epidemic Sound</div>
            <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">Playlist musicale — références lo-fi</div>
          </div>
        </div>

        <!-- Tracks prévisualisées (issues de GD_PLAYLIST filtrées ES) -->
        <div style="padding:16px 24px;display:flex;flex-direction:column;gap:8px;" id="es-tracks">
          ${GD_PLAYLIST.filter(t => t.plateforme === 'Epidemic Sound').map((t, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg3);border:1px solid var(--gris2);border-left:2px solid #1db954;">
              <div style="width:32px;height:32px;background:${t.cover_color};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🎵</div>
              <div style="flex:1;min-width:0;">
                <div style="font-family:var(--font-display);font-size:.78rem;color:var(--creme);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.titre}</div>
                <div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);margin-top:2px;">${t.artiste} · ${t.style}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="padding:16px 24px;border-top:1px solid var(--gris2);">
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;line-height:1.8;margin-bottom:12px;">Epidemic Sound ne propose pas d'embed public. Accès direct à la playlist complète ↓</div>
          <a href="${this.ES_URL}" target="_blank" style="
            display:block;text-align:center;
            font-family:var(--font-display);font-size:10px;font-weight:700;letter-spacing:2px;
            color:var(--bg);background:#1db954;padding:10px;
            text-decoration:none;text-transform:uppercase;transition:opacity .15s;
          " onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            Écouter sur Epidemic Sound ↗
          </a>
        </div>
      </div>

      <!-- Uppbeat -->
      <div style="background:var(--bg2);border:1px solid var(--gris2);overflow:hidden;">
        <div style="padding:20px 24px;border-bottom:1px solid var(--gris2);display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;background:#ff6b35;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div>
            <div style="font-family:var(--font-display);font-size:.9rem;color:var(--or);letter-spacing:2px;">Uppbeat</div>
            <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">Board partagé — ambient & world</div>
          </div>
        </div>

        <div style="padding:16px 24px;display:flex;flex-direction:column;gap:8px;">
          ${GD_PLAYLIST.filter(t => t.plateforme === 'Uppbeat').map(t => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg3);border:1px solid var(--gris2);border-left:2px solid #ff6b35;">
              <div style="width:32px;height:32px;background:${t.cover_color};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🎵</div>
              <div style="flex:1;min-width:0;">
                <div style="font-family:var(--font-display);font-size:.78rem;color:var(--creme);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.titre}</div>
                <div style="font-family:var(--font-mono);font-size:7px;color:var(--txt2);margin-top:2px;">${t.artiste} · ${t.style}</div>
              </div>
            </div>
          `).join('')}
          <!-- Placeholder si aucun track Uppbeat dans GD -->
          ${GD_PLAYLIST.filter(t => t.plateforme === 'Uppbeat').length === 0 ? `
            <div style="padding:20px;text-align:center;font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;">Ajoutez des tracks Uppbeat dans gamedata.js</div>
          ` : ''}
        </div>

        <div style="padding:16px 24px;border-top:1px solid var(--gris2);">
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;line-height:1.8;margin-bottom:12px;">Uppbeat ne propose pas d'embed public. Accès direct au board partagé ↓</div>
          <a href="${this.UB_URL}" target="_blank" style="
            display:block;text-align:center;
            font-family:var(--font-display);font-size:10px;font-weight:700;letter-spacing:2px;
            color:white;background:#ff6b35;padding:10px;
            text-decoration:none;text-transform:uppercase;transition:opacity .15s;
          " onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            Écouter sur Uppbeat ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Note droits -->
    <div style="padding:16px 20px;border:1px solid var(--gris2);background:var(--bg2);">
      <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;line-height:2;">
        🔒 <strong style="color:var(--txt2);">Droits musicaux :</strong> Toutes les pistes sont soumises à licence.
        Cibles : <span style="color:var(--txt2);">Artlist.io · Epidemic Sound · Uppbeat</span>
        · Références directes : <span style="color:var(--txt2);">Nujabes / Fat Jon / Force of Nature</span>
      </div>
    </div>

  </div>
</div>`;
  },

  init() {}
};
