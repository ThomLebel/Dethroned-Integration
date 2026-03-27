/**
 * pages/arena-forge.js — Intégration arena_forge_v2.html
 */
window.PAGE_ARENA_FORGE = {
  render() {
    return `
<div class="page-enter" style="height:calc(100vh - var(--nav-h));display:flex;flex-direction:column;">
  <div style="
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 20px;background:var(--bg2);border-bottom:1px solid var(--gris2);
    flex-shrink:0;
  ">
    <div style="font-family:var(--font-display);font-size:13px;color:var(--or);letter-spacing:3px;">ARENA FORGE</div>
    <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:2px;">Éditeur d'arènes — v2</div>
  </div>
  <iframe src="arena_forge_v2.html"
    style="flex:1;border:none;width:100%;display:block;"
    title="Arena Forge — Dethroned"
    loading="lazy">
  </iframe>
</div>`;
  },

  init() {}
};
