/**
 * pages/arena-forge.js — Wrapper SPA pour Arena Forge
 */
window.PAGE_ARENA_FORGE = {
  _ready: false,

  render() {
    return `<div id="tool-af-wrap" style="height:calc(100vh - var(--nav-h));overflow:hidden;display:flex;flex-direction:column;"></div>`;
  },

  init() {
    const wrap = document.getElementById('tool-af-wrap');
    if (!wrap) return;

    // Injecter le style scopé (une seule fois)
    if (!document.getElementById('style-tool-af')) {
      const st = document.createElement('style');
      st.id = 'style-tool-af';
      st.textContent = AF_SCOPED_CSS;
      document.head.appendChild(st);
    }

    // Injecter le HTML (enveloppé dans #tool-af pour que le CSS scopé s'applique)
    wrap.innerHTML = `<div id="tool-af" style="display:flex;flex-direction:column;height:100%;">${AF_BODY_HTML}</div>`;

    // Injecter le script (rechargement à chaque visite pour réinitialiser l'état)
    const old = document.getElementById('script-tool-af');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'script-tool-af';
    s.src = 'pages/arena-forge-logic.js';
    s.onload = () => {
      // buildEnemyPalette et generateArena sont appelés à la fin du script
      // mais les éléments DOM sont maintenant présents → ça fonctionne
    };
    document.body.appendChild(s);
  }
};
