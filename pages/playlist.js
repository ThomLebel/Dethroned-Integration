/**
 * pages/playlist.js — Lecteur audio custom
 * Lit GD_PLAYLIST depuis gamedata.js
 * Bouton "Écouter" ouvre le lien externe — pas de streaming embarqué
 */
window.PAGE_PLAYLIST = {
  current: 0,

  render() {
    return `
<div class="page-enter">
  <div class="page-hero">
    <div class="section-label">Musiques du Jeu</div>
    <h1>Playlist</h1>
    <p class="lead">Références musicales pour <em>Dethroned</em> — lo-fi hip-hop, jazz instrumental, ambient. Inspiré de l'esthétique Nujabes / Samurai Champloo.</p>
  </div>

  <section style="padding:48px 60px;display:grid;grid-template-columns:340px 1fr;gap:40px;min-height:60vh;background:var(--bg2);border-bottom:1px solid var(--gris2);">

    <!-- Lecteur principal -->
    <div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--or);margin-bottom:16px;">EN COURS</div>
      <div id="pl-player" style="
        background:var(--bg3);border:1px solid var(--gris2);
        padding:28px;border-top:2px solid var(--or);
      ">
        <!-- Artwork placeholder -->
        <div id="pl-artwork" style="
          width:100%;aspect-ratio:1;margin-bottom:20px;
          display:flex;align-items:center;justify-content:center;
          font-size:48px;border:1px solid var(--gris2);
          transition:background .4s;
        ">🎵</div>

        <div id="pl-title" style="font-family:var(--font-display);font-size:1.1rem;color:var(--creme);letter-spacing:1px;margin-bottom:6px;"></div>
        <div id="pl-artist" style="font-family:var(--font-mono);font-size:9px;color:var(--or);letter-spacing:2px;margin-bottom:4px;"></div>
        <div id="pl-style" style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-bottom:16px;"></div>
        <div id="pl-note" style="
          font-style:italic;font-size:.85rem;color:var(--txt2);
          line-height:1.6;padding:10px 14px;
          background:var(--bg4);border-left:2px solid var(--gris2);
          margin-bottom:20px;min-height:50px;
        "></div>

        <!-- Contrôles -->
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
          <button onclick="PAGE_PLAYLIST.prev()" style="
            background:transparent;border:1px solid var(--gris2);
            color:var(--txt2);font-family:var(--font-mono);font-size:10px;
            padding:8px 14px;cursor:pointer;transition:all .15s;
          " onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'"
             onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">◀</button>

          <a id="pl-listen-btn" href="#" target="_blank" style="
            flex:1;display:block;text-align:center;
            font-family:var(--font-display);font-size:10px;font-weight:700;
            letter-spacing:3px;color:var(--bg);background:var(--or);
            padding:11px;text-decoration:none;text-transform:uppercase;
            transition:background .15s;
          " onmouseover="this.style.background='var(--or2)'"
             onmouseout="this.style.background='var(--or)'">▶ Écouter</a>

          <button onclick="PAGE_PLAYLIST.next()" style="
            background:transparent;border:1px solid var(--gris2);
            color:var(--txt2);font-family:var(--font-mono);font-size:10px;
            padding:8px 14px;cursor:pointer;transition:all .15s;
          " onmouseover="this.style.borderColor='var(--or)';this.style.color='var(--or)'"
             onmouseout="this.style.borderColor='var(--gris2)';this.style.color='var(--txt2)'">▶</button>
        </div>

        <!-- Plateforme badge -->
        <div id="pl-platform" style="text-align:center;font-family:var(--font-mono);font-size:8px;letter-spacing:2px;color:var(--txt3);"></div>
      </div>

      <!-- Note sur les droits -->
      <div style="margin-top:16px;padding:12px 16px;border:1px solid var(--gris3);background:var(--bg3);">
        <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt3);letter-spacing:1px;line-height:1.8;">
          🔒 Toutes les pistes sont soumises à licence.<br>
          Cibles : Artlist.io · Epidemic Sound · Uppbeat<br>
          Références : Nujabes / Fat Jon (outreach direct)
        </div>
      </div>
    </div>

    <!-- Liste des tracks -->
    <div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--or);margin-bottom:16px;">
        TRACKLIST — <span style="color:var(--txt2);">${GD_PLAYLIST.length} pistes</span>
      </div>
      <div id="pl-list" style="display:flex;flex-direction:column;gap:4px;"></div>

      <!-- Ajouter une piste -->
      <div style="margin-top:32px;padding:20px;background:var(--bg3);border:1px dashed var(--gris2);">
        <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:2px;color:var(--txt2);margin-bottom:14px;">+ AJOUTER UNE PISTE</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <input id="add-titre" placeholder="Titre" style="background:var(--bg4);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:10px;padding:7px 10px;outline:none;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
          <input id="add-artiste" placeholder="Artiste" style="background:var(--bg4);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:10px;padding:7px 10px;outline:none;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
          <input id="add-url" placeholder="URL (YouTube, Epidemic Sound…)" style="background:var(--bg4);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:10px;padding:7px 10px;outline:none;grid-column:span 2;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
          <input id="add-style" placeholder="Style (Lo-fi, Jazz…)" style="background:var(--bg4);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:10px;padding:7px 10px;outline:none;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
          <input id="add-note" placeholder="Note / contexte" style="background:var(--bg4);border:1px solid var(--gris2);color:var(--txt);font-family:var(--font-mono);font-size:10px;padding:7px 10px;outline:none;" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gris2)'">
        </div>
        <button onclick="PAGE_PLAYLIST.addTrack()" style="
          width:100%;background:transparent;border:1px solid var(--or);
          color:var(--or);font-family:var(--font-mono);font-size:9px;
          letter-spacing:2px;padding:9px;cursor:pointer;text-transform:uppercase;
          transition:all .15s;
        " onmouseover="this.style.background='var(--or-dim)'" onmouseout="this.style.background='transparent'">
          Ajouter à la playlist
        </button>
      </div>
    </div>
  </section>
</div>`;
  },

  init() {
    this.current = 0;
    this.renderList();
    this.updatePlayer();
  },

  renderList() {
    const list = document.getElementById('pl-list');
    if (!list) return;
    list.innerHTML = GD_PLAYLIST.map((track, i) => `
      <div onclick="PAGE_PLAYLIST.select(${i})" style="
        display:flex;align-items:center;gap:14px;
        padding:12px 16px;background:${i === this.current ? 'var(--bg4)' : 'var(--bg3)'};
        border:1px solid ${i === this.current ? 'var(--or)' : 'var(--gris2)'};
        cursor:pointer;transition:all .15s;
      " onmouseover="if(${i}!==PAGE_PLAYLIST.current){this.style.borderColor='var(--gris)';this.style.background='var(--bg4)';}"
         onmouseout="if(${i}!==PAGE_PLAYLIST.current){this.style.borderColor='var(--gris2)';this.style.background='var(--bg3)';}">
        <div style="
          width:36px;height:36px;flex-shrink:0;
          background:${track.cover_color || '#3a3028'};
          display:flex;align-items:center;justify-content:center;
          font-size:16px;border:1px solid rgba(255,255,255,.1);
        ">${i === this.current ? '▶' : '🎵'}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:var(--font-display);font-size:.85rem;color:${i === this.current ? 'var(--or)' : 'var(--creme2)'};letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${track.titre}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:1px;margin-top:2px;">${track.artiste} · ${track.style}</div>
        </div>
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:1px;color:var(--txt3);flex-shrink:0;border:1px solid var(--gris3);padding:2px 6px;">${track.plateforme}</div>
        <a href="${track.url}" target="_blank" onclick="event.stopPropagation()" style="
          font-size:10px;color:var(--txt3);text-decoration:none;flex-shrink:0;
          transition:color .15s;
        " onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--txt3)'">↗</a>
      </div>
    `).join('');
  },

  updatePlayer() {
    const track = GD_PLAYLIST[this.current];
    if (!track) return;
    const artwork = document.getElementById('pl-artwork');
    const title   = document.getElementById('pl-title');
    const artist  = document.getElementById('pl-artist');
    const style   = document.getElementById('pl-style');
    const note    = document.getElementById('pl-note');
    const btn     = document.getElementById('pl-listen-btn');
    const plat    = document.getElementById('pl-platform');
    if (artwork) artwork.style.background = track.cover_color || '#3a3028';
    if (title)   title.textContent   = track.titre;
    if (artist)  artist.textContent  = track.artiste;
    if (style)   style.textContent   = track.style;
    if (note)    note.textContent    = track.note || '—';
    if (btn)     btn.href            = track.url;
    if (plat)    plat.textContent    = `▶ Ouvre sur ${track.plateforme}`;
  },

  select(i) {
    this.current = i;
    this.renderList();
    this.updatePlayer();
  },
  prev() { this.select((this.current - 1 + GD_PLAYLIST.length) % GD_PLAYLIST.length); },
  next() { this.select((this.current + 1) % GD_PLAYLIST.length); },

  addTrack() {
    const titre   = document.getElementById('add-titre')?.value.trim();
    const artiste = document.getElementById('add-artiste')?.value.trim();
    const url     = document.getElementById('add-url')?.value.trim();
    const style   = document.getElementById('add-style')?.value.trim() || 'Divers';
    const note    = document.getElementById('add-note')?.value.trim() || '';
    if (!titre || !url) return;
    const plateforme = url.includes('youtube') ? 'YouTube'
      : url.includes('epidemicsound') ? 'Epidemic Sound'
      : url.includes('uppbeat') ? 'Uppbeat'
      : url.includes('artlist') ? 'Artlist'
      : 'Autre';
    GD_PLAYLIST.push({ titre, artiste: artiste || '?', style, plateforme, url, note, cover_color:'#3a3028', tags:[] });
    ['add-titre','add-artiste','add-url','add-style','add-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this.renderList();
  }
};
